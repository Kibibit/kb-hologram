import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { SvgMaker, SvgMakerResultType } from './image-maker';

// const toMatchImageSnapshot = configureToMatchImageSnapshot();

expect.extend({ toMatchImageSnapshot });

const FONT_PATH = '../Comfortaa-Regular.ttf';
const HEIGHT = 534;
const WIDTH = 1069;

describe('image maker', () => {
  it('should generate svg string with params', async () => {
    const svgMaker = new SvgMaker({
      fontName: FONT_PATH,
      templateName: 'template-test-reporter',
      height: HEIGHT,
      width: WIDTH,
      data: {
        unitCoverage: 666,
        e2eCoverage: 333
      }
    });

    const svgString = await svgMaker.render(SvgMakerResultType.SvgString);

    expect(svgString).toContain(666);
    expect(svgString).toContain(333);
    expect(svgString).toMatchSnapshot();
  });

  it('should generate svg buffer', async (done) => {
    const svgMaker = new SvgMaker({
      fontName: FONT_PATH,
      templateName: 'template-test-reporter',
      height: HEIGHT,
      width: WIDTH,
      data: {
        unitCoverage: 666,
        e2eCoverage: 333
      }
    });

    const svgBuffer = await svgMaker.render(SvgMakerResultType.SvgBuffer);

    expect(svgBuffer).toBeInstanceOf(Buffer);
    expect(svgBuffer.toString('base64')).toMatchSnapshot();

    done();
  });

  it('should generate svg Base64 string', async () => {
    const svgMaker = new SvgMaker({
      fontName: FONT_PATH,
      templateName: 'template-test-reporter',
      height: HEIGHT,
      width: WIDTH,
      data: {
        unitCoverage: 666,
        e2eCoverage: 333
      }
    });

    const svgB64String = await svgMaker.render(SvgMakerResultType.Base64Svg);

    expect(svgB64String).toMatchSnapshot();
  });

  it('should generate a coverage image from template', async () => {
    const svgMaker = new SvgMaker({
      fontName: FONT_PATH,
      templateName: 'template-test-reporter',
      height: HEIGHT,
      width: WIDTH,
      data: {
        unitCoverage: 666,
        e2eCoverage: 333
      }
    });

    const pngBuffer = await svgMaker.render(SvgMakerResultType.PngBuffer);

    // writeFile('na.png', pngBuffer);

    (expect(pngBuffer) as any).toMatchImageSnapshot({
      blur: 2
    });
  });

  it('should generate changelog from html template', async () => {
    const svgMaker = new SvgMaker({
      fontName: '../Comfortaa-Regular.ttf',
      templateName: 'changelog-template',
      height: 534,
      width: 1069,
      data: {
        columnOne: [
          'Compact folders in Explorer',
          'Edit both files in diff view',
          'Search results update while typing',
          'Problems panel filtering by type',
          'Minimap highlights errors, changes',
          'Terminal minimum contrast ratio'
        ],
        columnTwo: [
          'Mirror cursor in HTML tags',
          'Optional chaining support in JS\\TS',
          'Extract to interface TS refactoring',
          'Sass module support for @use',
          'Remote - Containers improvements',
          'Visual Studio Online preview'
        ],
        title: 'achievibit',
        subtitle: 'v2.1.4 - CHANGELOG',
        logo: {
          url: 'data:image/png;base64,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',
          alt: 'kibibit'
        }
      },
      type: 'html'
    });

    const pngBuffer = await svgMaker.render(SvgMakerResultType.PngBuffer);

    // await writeFile('nice.svg', pngBuffer);

    (expect(pngBuffer) as any).toMatchImageSnapshot({
      blur: 2
    });
  });
});
