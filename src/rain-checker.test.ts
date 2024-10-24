import puppeteer from 'puppeteer'

const browserConfig = {
  headless: true,
  devtools: false,
  args: ['--no-sandbox', '--disable-setuid-sandbox'] // For running on debian in docker
}
const x = 167422.01
const y = -3771963.62


describe('Check for rain Other', () => {
  let browser: any
  beforeEach(async () => {
    browser = await puppeteer.launch(browserConfig)
  })
  afterEach(async () => {
    await browser.close()
  })
  it('check for rain 2', async () => {
    const page = await browser.newPage()
    const bbox = encodeURIComponent(`${x - 15},${y - 15},${x + 15},${y + 15}`)
    const date = new Date()
    date.setSeconds(0)
    const min = date.getMinutes()
    if (min % 5 !== 0) {
      date.setMinutes(min - (min % 5))
    }
    const dateEncoded = encodeURIComponent(date.toISOString())

    date.setTime(date.getTime() + 1 * 60 * 60 * 1000)
    const endDateEncoded = encodeURIComponent(date.toISOString())

    const url = `https://www.dmi.dk/ZoombareKort/map?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TIME=${endDateEncoded}&REFERENCE_TIME=${dateEncoded}&LAYERS=nowcast_radar&WIDTH=512&HEIGHT=512&SRS=EPSG%3A3575&STYLES=&BBOX=${bbox}`
    await page.goto(url)
    console.log(url)

    // Get the canvas and find a single pixel around Copenhagen
    const pixel = await page.evaluate(() => {
      const img = <HTMLImageElement>document.querySelector('img')
      const canvas = <HTMLCanvasElement>document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const canvasContext = canvas.getContext('2d')
      console.log(canvas, canvasContext)
      if (canvasContext) {
        canvasContext.drawImage(img, 0, 0)
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
