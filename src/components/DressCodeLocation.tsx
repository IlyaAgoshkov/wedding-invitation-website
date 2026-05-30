import { InvitationCard } from './InvitationCard'
import { ScrollReveal } from './ScrollReveal'

const palette = [
  { color: '#A3C1DA', name: 'Голубой' },
  { color: '#D9E4EC', name: 'Небесный' },
  { color: '#F2E8D5', name: 'Бежевый' },
  { color: '#FAFAFA', name: 'Молочный' },
  { color: '#D1D1D1', name: 'Светло-серый' },
]

export function DressCodeLocation() {
  return (
    <section id="dress-code" className="section dress-code-section">
      <ScrollReveal>
        <InvitationCard className="dress-code-card">
          <h2 className="card-title">ДРЕСС-КОД</h2>
          <p className="dress-code-intro">
            Нам будет приятно, если вы поддержите цветовую палитру нашей свадьбы —
            так мы вместе создадим атмосферу лёгкости, нежности и единого настроения
            в этот особенный день.
          </p>
          <p className="card-subtitle">Цветовая палитра</p>
          <ul className="palette palette--wide">
            {palette.map((swatch) => (
              <li key={swatch.name}>
                <span
                  className="palette__swatch"
                  style={{ backgroundColor: swatch.color }}
                />
                <span className="palette__name">{swatch.name}</span>
              </li>
            ))}
          </ul>
        </InvitationCard>
      </ScrollReveal>
    </section>
  )
}
