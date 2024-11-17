import { IKbHologramBaseOptions, KbHologram, KbHologramResultType } from "@kibibit/kb-hologram";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import { join } from "path";

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/', async (req: Request, res: Response) => {
  const kbHologramOptions = getKbHologramOptions(req.body);
  const kbHologram = new KbHologram(kbHologramOptions);

  const pngBuffer = await kbHologram.render(KbHologramResultType.PngBuffer);

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': pngBuffer.length
  });

  res.end(pngBuffer);
});

app.listen(port, () => {
  console.log(`kb-hologram server listening on port ${port}`);
});

function getKbHologramOptions(
  body: Record<string, any> = {}
): IKbHologramBaseOptions {
  const {
    templateName,
    templateFile,
    height,
    width,
    data
  } = body || {};

  // same as IKbHologramBaseOptions but without the templateName or templateFile
  // properties
  const baseOptions: Omit<IKbHologramBaseOptions, 'templateName' | 'templateFile'> = {
    fontName: "../Comfortaa-Regular.ttf",
    height: height || Math.floor(534),
    width: width || Math.floor(1069),
    data: data || {
      apiStatus: 'FAILED',
      e2eStatus: 'PASSED'
    },
    type: "svg",
    executablePath: '/usr/bin/chromium'
  };

  if (templateName) {
    const fullOptions: IKbHologramBaseOptions = {
      ...baseOptions,
      templateName
    };

    return fullOptions;
  }

  if (templateFile) {
    const fullOptions: IKbHologramBaseOptions = {
      ...baseOptions,
      templateFile
    };

    return fullOptions;
  }

  return {
    ...baseOptions,
    templateFile: join(__dirname, '../template-test-reporter.svg')
  };
}
