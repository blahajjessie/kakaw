import { useState, useEffect } from "react"

interface Content {
  mobileContent: JSX.Element,
  desktopContent: JSX.Element,
}

export default function MatchMediaWrapper({ mobileContent, desktopContent }: Content) {
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)

  useEffect(() => {
    const mediaWatcher = window.matchMedia("(max-width: 500px)")
    setIsNarrowScreen(mediaWatcher.matches);

    function updateIsNarrowScreen(e: MediaQueryListEvent) {
      setIsNarrowScreen(e.matches);
    }

    if (mediaWatcher.addEventListener) {
      mediaWatcher.addEventListener('change', updateIsNarrowScreen)
      return function cleanup() {
        mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
      }
    } else {
      mediaWatcher.addListener(updateIsNarrowScreen)
      return function cleanup() {
        mediaWatcher.removeListener(updateIsNarrowScreen)
      }
    }
  }, [])

  return isNarrowScreen ? mobileContent : desktopContent
}
