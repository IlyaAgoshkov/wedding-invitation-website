import { InvitationCard } from './InvitationCard'
import { ScrollReveal } from './ScrollReveal'

export function GiftWishes() {
  return (
    <section id="gifts" className="section gift-wishes-section">
      <ScrollReveal>
        <InvitationCard className="gift-wishes-card">
          <h2 className="card-title">ПОЖЕЛАНИЯ ПО ПОДАРКАМ</h2>
          <p className="gift-wishes-text">
            Ваше присутствие в день нашей свадьбы — самый ценный подарок для нас.
          </p>
          <p className="gift-wishes-text">
            Если вы захотите поздравить нас подарком, мы будем рады вкладу в бюджет
            нашей молодой семьи. Это поможет нам осуществить наши общие мечты и планы.
          </p>
        </InvitationCard>
      </ScrollReveal>
    </section>
  )
}
