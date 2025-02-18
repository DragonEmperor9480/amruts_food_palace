let splashElement: HTMLElement | null = null

export const initSplash = () => {
  splashElement = document.createElement('div')
  splashElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    cursor: pointer;
  `

  const gif = document.createElement('img')
  gif.src = '/gifs/beginning.gif'
  gif.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
  `

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4rem 0;
  `

  const title = document.createElement('h1')
  title.textContent = "Amrut's Food Palace"
  title.style.cssText = `
    text-align: center;
    color: white;
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  `

  const tapText = document.createElement('p')
  tapText.textContent = 'Tap to Order'
  tapText.style.cssText = `
    text-align: center;
    color: white;
    font-size: 2.5rem;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  `

  overlay.appendChild(title)
  overlay.appendChild(tapText)
  splashElement.appendChild(gif)
  splashElement.appendChild(overlay)

  document.body.appendChild(splashElement)
  document.body.style.overflow = 'hidden'

  splashElement.addEventListener('click', removeSplash)
}

const removeSplash = () => {
  if (splashElement) {
    splashElement.style.opacity = '0'
    splashElement.style.transition = 'opacity 0.5s ease'

    setTimeout(() => {
      splashElement?.remove()
      document.body.style.overflow = 'auto'
      splashElement = null
    }, 500)
  }
}
