import fileType from "file-type";
import { readdir, readFile, readFileSync } from "fs-extra";
import { compile } from "handlebars";
import { isString, startsWith } from "lodash";
import { join } from "path";
import puppeteer from "puppeteer";
import svg2png from "svg2png";

export enum SvgMakerResultType {
  Base64Png = "Base64Png",
  Base64Svg = "Base64Svg",
  SvgString = "SvgString",
  SvgBuffer = "SvgBuffer",
  PngBuffer = "PngBuffer",
}

export type StringReturnInputs =
  | SvgMakerResultType.Base64Png
  | SvgMakerResultType.Base64Svg
  | SvgMakerResultType.SvgString;

export type BufferReturnInputs =
  | SvgMakerResultType.SvgBuffer
  | SvgMakerResultType.PngBuffer;

export interface ISvgMakerBaseOptions {
  templateName?: string;
  templateFile?: string | Buffer;
  templateString?: string;
  fontName?: string;
  width: number;
  height: number;
  data: {
    [key: string]: any;
  };
  type?: "svg" | "html";
}

export class SvgMaker {
  private templateFilePath = "";
  // constructor(options: ISvgMakerNameOptions)
  // constructor(options: ISvgMakerFileOptions)
  // constructor(options: ISvgMakerStringOptions)
  constructor(public options: ISvgMakerBaseOptions) {}

  async render(resultType: StringReturnInputs): Promise<string>;
  async render(resultType: BufferReturnInputs): Promise<Buffer>;
  async render(
    resultType: SvgMakerResultType = SvgMakerResultType.SvgString
  ): Promise<string | Buffer> {
    try {
      const template = await this.getTemplateAsString();

      const handlebarsTemplate = compile(template);
      const fontBase64 = this.options.fontName
        ? await this.convertFontToBase64String(
            join(__dirname, this.options.fontName)
          )
        : undefined;

      const data = {
        ...this.options.data,
        fontBase64,
        width: this.options.width,
        height: this.options.height,
      };

      const svgString = handlebarsTemplate(data);

      if (this.options.type === "html") {
        this.templateFilePath =
          this.templateFilePath || (this.options.templateFile as string);
        const browser = await puppeteer.launch({
          headless: "new",
        });
        const page = await browser.newPage();
        await page.setViewport({
          height: this.options.height,
          width: this.options.width,
        });
        await page.goto("file://" + this.templateFilePath);
        await page.addScriptTag({
          content: `
          activate(${JSON.stringify(this.options.data)})
          `,
        });
        const imageBuffer = await page.screenshot({});

        await browser.close();

        if (resultType === SvgMakerResultType.Base64Png) {
          return this.bufferToBase64String(imageBuffer);
        }

        return imageBuffer;
      }

      if (resultType === SvgMakerResultType.SvgString) {
        return svgString;
      }

      const svgFile = Buffer.from(svgString, "utf8");

      if (resultType === SvgMakerResultType.SvgBuffer) {
        return svgFile;
      }

      if (resultType === SvgMakerResultType.Base64Svg) {
        return this.bufferToBase64String(svgFile, {
          mime: "image/svg+xml",
          ext: "svg",
        });
      }

      const pngFile = await svg2png(svgFile, {
        height: this.options.height,
        width: this.options.width,
      });

      if (resultType === SvgMakerResultType.PngBuffer) {
        return pngFile;
      }

      return this.bufferToBase64String(pngFile);
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  async convertFontToBase64String(fontFile: string): Promise<string> {
    const data = await readFile(fontFile);
    const buff = Buffer.from(data);
    const filetype = this.fileType(buff);

    const base64data = buff.toString("base64");

    // writeFileSync('font-base64.txt', `data:${ filetype.mime };base64,${ base64data }`);

    return `data:${filetype.mime};base64,${base64data}`;
  }

  bufferToBase64String(
    buff: Buffer,
    filetype: any = this.fileType(buff)
  ): string {
    return `data:${filetype.mime};base64,${buff.toString("base64")}`;
  }

  fileType(buff: Buffer) {
    const filetype = fileType(buff);

    if (!filetype) {
      throw new Error("filetype returned undefined");
    }

    return filetype;
  }

  async getTemplateAsString(): Promise<string> {
    let template = "";

    if (isString(this.options.templateName)) {
      const allTemplates = await readdir(join(__dirname, "../templates"));

      const templateFilename = allTemplates.find((templateFilename) =>
        startsWith(templateFilename, this.options.templateName)
      );

      if (!templateFilename) {
        throw new Error("template filename not found");
      }

      this.templateFilePath = join(__dirname, "../templates", templateFilename);

      const filePath = join(__dirname, "../templates", `/${templateFilename}`);
      template = await readFile(filePath, { encoding: "UTF-8" });
    } else if (this.options.templateFile) {
      template = isString(this.options.templateFile)
        ? await readFile(this.options.templateFile, { encoding: "UTF-8" })
        : this.options.templateFile.toString();
    } else if (this.options.templateString) {
      template = this.options.templateString;
    }

    return template;
  }
}
