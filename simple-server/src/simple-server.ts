import { IKbHologramBaseOptions, KbHologram, KbHologramResultType } from "@kibibit/kb-hologram";
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import { join } from "path";
import { createCache } from "cache-manager";
import { CacheableMemory } from "cacheable";
import { Keyv } from 'keyv';

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// Create a memory cache with a TTL of 1 week
const memoryCache = createCache({
  stores: [
    new Keyv({
      store: new CacheableMemory({ ttl: 7 * 24 * 60 * 60, lruSize: 5000 }),
    })
  ],
  ttl: 7 * 24 * 60 * 60 // TTL in seconds (1 week)
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/', async (req: Request, res: Response) => {
  const cacheKey = JSON.stringify(req.body);

  try {
    // Check if the image is cached
    const cachedImage: Buffer | null = await memoryCache.get(cacheKey);

    if (cachedImage) {
      console.log('Cache hit');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': cachedImage.length
      });

      res.end(cachedImage);

      return;
    }

    console.log('Cache miss');
    // Generate a new image if not cached
    const kbHologramOptions = getKbHologramOptions(req.body);
    const kbHologram = new KbHologram(kbHologramOptions);
    const pngBuffer = await kbHologram.render(KbHologramResultType.PngBuffer);

    // Cache the generated image
    await memoryCache.set(cacheKey, pngBuffer);

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': pngBuffer.length
    });
    res.end(pngBuffer);

  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image');
  }
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
