import puppeteer from 'puppeteer'

const browserConfig = {
  headless: true,
  devtools: false,
  args: ['--no-sandbox', '--disable-setuid-sandbox'] // For running on debian in docker
}
// const x = 157225.64
// const y = -3770863.25
const x = -4940.77
const y = -3623871.87
describe('Check for rain', () => {
  let browser: any
  beforeEach(async () => {
    browser = await puppeteer.launch(browserConfig)
  })
  afterEach(async () => {
    await browser.close()
  })
  it('check for rain 2', async () => {
    const page = await browser.newPage()
    const bbox = `${x - 15},${y - 15},${x + 15},${y + 15}`
    await page.goto(
      `https://www.dmi.dk/ZoombareKort/map?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TIME=2022-05-19T20%3A00%3A00Z&REFERENCE_TIME=2022-05-19T19%3A55%3A00Z&LAYERS=nowcast_radar&WIDTH=512&HEIGHT=512&SRS=EPSG%3A3575&STYLES=&BBOX=${encodeURIComponent(
        bbox
      )}`
    )
    console.log(
      `https://www.dmi.dk/ZoombareKort/map?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TIME=2022-05-19T20%3A00%3A00Z&REFERENCE_TIME=2022-05-19T19%3A55%3A00Z&LAYERS=nowcast_radar&WIDTH=512&HEIGHT=512&SRS=EPSG%3A3575&STYLES=&BBOX=${encodeURIComponent(
        bbox
      )}`
    )
    // Get the canvas and find a single pixel around Copenhagen
    const pixel = await page.evaluate(() => {
      const canvas = <HTMLCanvasElement>document.createElement('canvas')
      const img = <HTMLImageElement>document.getElementsByClassName('shrinkToFit')[0]
      console.log(img)
      canvas.width = img.width
      canvas.height = img.height
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const canvasContext = canvas.getContext('2d')
      console.log(canvas, canvasContext)
      if (canvasContext) {
        // Get one pixel in the center of the image
        return canvasContext.getImageData(centerX, centerY, 1, 1).data
      }
      return []
    })
    console.log(pixel)

    if (!pixel) {
      fail()
    }

    // It's usually rgb (255,255,255), white, that is no rain.
    // Make the test pass if there is some form of rain and fail if there is no rain
    expect(pixel).not.toMatchObject({ 0: 255, 1: 255, 2: 255 })
  })
})

// Progress bar locations
// from '(979, 836)'
// to '(1530, 835)'

// Try to find the pixel code
// var canvas = document.evaluate("/html/body/main/section[2]/div[1]/div/div[2]/div/div/div/div/div/div[1]/div[1]/div/canvas", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
// var context = canvas.getContext('2d');
// context.fillRect(705,410,5,5);
