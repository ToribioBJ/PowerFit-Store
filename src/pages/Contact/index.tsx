import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaWhatsapp, 
  FaPaperPlane, 
  FaCheckCircle 
} from 'react-icons/fa';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!formData.message.trim()) newErrors.message = 'El mensaje no puede estar vacío';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className={`${styles.contactContainer} container`}>
      <header className={styles.contactHeader}>
        <span className={styles.contactSubtitle}>¿Tienes preguntas?</span>
        <h1 className={styles.contactTitle}>Ponte en Contacto</h1>
      </header>

      <div className={styles.contactLayout}>
        {/* Left Column: Contact Info & Map */}
        <div className={styles.infoColumn}>
          {/* Contact Details Card */}
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Atención al Cliente</h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.infoText}>
                  <h4>Ubicación</h4>
                  <p>Av. Fitness 456, Miraflores, Lima, Perú</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaPhoneAlt />
                </div>
                <div className={styles.infoText}>
                  <h4>Teléfono</h4>
                  <p>+51 987 654 321</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaEnvelope />
                </div>
                <div className={styles.infoText}>
                  <h4>Correo Electrónico</h4>
                  <p>soporte@powerfit.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}>
                  <FaClock />
                </div>
                <div className={styles.infoText}>
                  <h4>Horario de Atención</h4>
                  <p>Lun - Sáb: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
            
            <a 
              href="https://wa.me/51987654321?text=Hola%20PowerFit%20Store%2C%20quisiera%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ marginTop: '24px', width: '100%' }}
            >
              <FaWhatsapp style={{ fontSize: '1.2rem' }} /> Chatear con Soporte
            </a>
          </div>

          {/* Styled Google Maps Embed */}
          <div className={styles.mapCard}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m12!1m3!1d15602.8398018318!2d-77.03704257121287!3d-12.12211904791535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8194b306059%3A0xc3911369d2de6b!2sMiraflores!5e0!3m2!1ses-419!2spe!4v1680000000000!5m2!1ses-419!2spe"
              className={styles.mapFrame}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map PowerFit Location"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className={styles.formCard}>
          {!isSubmitted ? (
            <>
              <h2 className={styles.formTitle}>Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.formInput}
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>{errors.name}</span>}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.formInput}
                    placeholder="Ej. +51 987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Subject */}
                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={styles.formInput}
                    placeholder="¿En qué te podemos ayudar?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    className={styles.formTextarea}
                    placeholder="Escribe tu consulta detallada aquí..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>{errors.message}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${styles.submitBtn} btn-primary`}
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <FaPaperPlane /> Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successCard}>
              <div className={styles.successIconWrapper}>
                <FaCheckCircle />
              </div>
              <h2 className={styles.successTitle}>¡Mensaje Enviado!</h2>
              <p className={styles.successDesc}>
                Tu consulta ha sido enviada con éxito. Nuestro equipo se pondrá en contacto contigo a la brevedad.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="btn-secondary"
                style={{ marginTop: '12px' }}
              >
                Enviar otro mensaje
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
