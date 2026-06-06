import { PageAtmosphere } from './components/PageAtmosphere'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { Countdown } from './components/Countdown'
import { LoveStory } from './components/LoveStory'
import { Program } from './components/Program'
import { Banquet } from './components/Banquet'
import { DressCodeLocation } from './components/DressCodeLocation'
import { GiftWishes } from './components/GiftWishes'
import { RSVP } from './components/RSVP'
import { MusicProvider } from './context/MusicContext'
import './index.css'

function App() {
  return (
    <MusicProvider>
      <div className="wedding-page">
        <Navigation />
        <PageAtmosphere />
        <Hero />
        <main className="page-main">
          <Countdown />
          <LoveStory />
          <Program />
          <Banquet />
          <DressCodeLocation />
          <GiftWishes />
          <RSVP />
        </main>
      </div>
    </MusicProvider>
  )
}

export default App
