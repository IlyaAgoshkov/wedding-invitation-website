import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { staggerContainer, staggerItemFade, instant } from '../motion/variants'
import { AnimatedButton } from './AnimatedButton'
import { InvitationCard } from './InvitationCard'
import { ScrollReveal } from './ScrollReveal'

type SuccessType = 'yes' | 'no' | null

const SUCCESS_MESSAGES = {
  yes: {
    title: 'Спасибо за ваш ответ! 💙',
    text: 'Мы очень рады, что вы разделите этот особенный день вместе с нами.\nС нетерпением ждём встречи 29 августа 2026 года!',
  },
  no: {
    title: 'Спасибо, что сообщили нам о своём решении.',
    text: 'Нам очень жаль, что в этот день вас не будет рядом, но мы ценим ваш ответ и понимание.\nНадеемся увидеться с вами в другой раз! 💙',
  },
}

export function RSVP() {
  const [attendance, setAttendance] = useState('yes')
  const [successType, setSuccessType] = useState<SuccessType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const reducedMotion = useReducedMotion()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const attendanceValue = String(formData.get('attendance') ?? 'yes')

    const lastName = String(formData.get('lastName') ?? '').trim()
    const firstName = String(formData.get('firstName') ?? '').trim()

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastName,
          firstName,
          attendance: attendanceValue,
          children: attendanceValue === 'yes' ? formData.get('children') : 'none',
          comment: String(formData.get('comment') ?? '').trim(),
        }),
      })

      const data = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(data?.error ?? 'Не удалось отправить ответ.')
      }

      setSuccessType(attendanceValue === 'yes' ? 'yes' : 'no')
      form.reset()
      setAttendance('yes')
    } catch (submitError) {
      setSuccessType(null)
      const message =
        submitError instanceof Error ? submitError.message : 'Не удалось отправить ответ.'
      setError(
        message === 'Failed to fetch' || message === 'fetch failed'
          ? 'Сервер недоступен. Перезапустите npm run dev:all и попробуйте снова.'
          : message || 'Не удалось отправить ответ. Попробуйте позже.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeSuccess = () => setSuccessType(null)

  return (
    <>
      {successType ? (
        <motion.div
          className="rsvp-success"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-success-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="rsvp-success__card"
            initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 id="rsvp-success-title" className="rsvp-success__title">
              {SUCCESS_MESSAGES[successType].title}
            </h3>
            <p className="rsvp-success__text">
              {SUCCESS_MESSAGES[successType].text.split('\n').map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </p>
            <button type="button" className="rsvp-success__close" onClick={closeSuccess}>
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      ) : null}

      <section id="rsvp" className="section rsvp-section">
        <InvitationCard className="rsvp-card">
          <ScrollReveal>
            <h2 className="card-title rsvp-card__title">ПОДТВЕРДИТЕ ПРИСУТСТВИЕ</h2>
            <div className="rsvp-card__intro">
              <p>Мы будем счастливы разделить этот особенный день вместе с вами.</p>
              <p>
                Будем благодарны, если вы сообщите о своём решении до{' '}
                <span className="rsvp-card__deadline">1 августа 2026 года</span>.
              </p>
            </div>
          </ScrollReveal>

          <motion.form
            className="rsvp-form"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reducedMotion ? instant : staggerContainer(0.1, 0.12)}
          >
            <motion.div
              className="rsvp-form__row"
              variants={reducedMotion ? instant : staggerItemFade}
            >
              <label className="rsvp-form__field-label">
                <span className="rsvp-form__field-title">Фамилия</span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Фамилия"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className="rsvp-form__field-label">
                <span className="rsvp-form__field-title">Имя</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Имя"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </motion.div>

            <motion.label variants={reducedMotion ? instant : staggerItemFade}>
              <span className="rsvp-form__field-title">Ваш ответ</span>
              <select
                name="attendance"
                value={attendance}
                onChange={(event) => setAttendance(event.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="yes">С радостью приду ❤️</option>
                <option value="no">К сожалению, не смогу</option>
              </select>
            </motion.label>

            <AnimatePresence initial={false}>
              {attendance === 'yes' ? (
                <motion.label
                  key="children-field"
                  className="rsvp-form__field-label"
                  initial={reducedMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="rsvp-form__field-title">Будут ли с вами дети?</span>
                  <select name="children" defaultValue="none" required disabled={isSubmitting}>
                    <option value="none">Нет</option>
                    <option value="1">Да, 1 ребёнок</option>
                    <option value="2">Да, 2 ребёнка</option>
                    <option value="3plus">Да, 3 и более детей</option>
                  </select>
                </motion.label>
              ) : null}
            </AnimatePresence>

            <motion.label variants={reducedMotion ? instant : staggerItemFade}>
              <span className="rsvp-form__field-title">Комментарий или пожелание</span>
              <textarea
                name="comment"
                placeholder="Комментарий или пожелание"
                rows={4}
                disabled={isSubmitting}
              />
            </motion.label>

            {error ? <p className="rsvp-form__error">{error}</p> : null}

            <motion.div variants={reducedMotion ? instant : staggerItemFade}>
              <AnimatedButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ ОТВЕТ'}
              </AnimatedButton>
            </motion.div>
          </motion.form>

          <motion.footer
            className="rsvp-footer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0.01 : 1, delay: 0.3 }}
          >
            <p className="rsvp-footer__wait">ЖДЁМ ВАС</p>
            <p className="rsvp-footer__sign">
              Дмитрий и Алёна <span aria-hidden="true">♥</span>
            </p>
          </motion.footer>
        </InvitationCard>
      </section>
    </>
  )
}
