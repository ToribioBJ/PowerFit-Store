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
    <div className="py-10 md:py-20 min-h-screen container animate-fadeIn">
      <header className="text-center mb-14">
        <span className="font-title font-black text-[0.9rem] text-accent tracking-widest uppercase mb-3 block">¿Tienes preguntas?</span>
        <h1 className="text-4xl font-extrabold uppercase text-gradient font-title">Ponte en Contacto</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
        {/* Left Column: Contact Info & Map */}
        <div className="flex flex-col gap-6">
          {/* Contact Details Card */}
          <div className="card-premium p-[30px] flex flex-col">
            <h2 className="text-[1.35rem] font-extrabold uppercase text-text-primary border-b border-border-brand/40 pb-3 mb-5 font-title">Atención al Cliente</h2>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[1.1rem] shrink-0 shadow-glow">
                  <FaMapMarkerAlt />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[0.95rem] font-bold uppercase mb-1 text-text-primary font-title">Ubicación</h4>
                  <p className="text-[0.95rem] text-text-secondary">Av. Fitness 456, Miraflores, Lima, Perú</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[1.1rem] shrink-0 shadow-glow">
                  <FaPhoneAlt />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[0.95rem] font-bold uppercase mb-1 text-text-primary font-title">Teléfono</h4>
                  <p className="text-[0.95rem] text-text-secondary">+51 924 215 942</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[1.1rem] shrink-0 shadow-glow">
                  <FaEnvelope />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[0.95rem] font-bold uppercase mb-1 text-text-primary font-title">Correo Electrónico</h4>
                  <p className="text-[0.95rem] text-text-secondary">neritosuplements@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-accent/5 border border-border-glow text-accent flex items-center justify-center text-[1.1rem] shrink-0 shadow-glow">
                  <FaClock />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[0.95rem] font-bold uppercase mb-1 text-text-primary font-title">Horario de Atención</h4>
                  <p className="text-[0.95rem] text-text-secondary">Lun - Sáb: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/51924215942?text=Hola%20Nerito%20Suplements%2C%20quisiera%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-6 w-full text-center"
            >
              <FaWhatsapp className="text-[1.2rem]" /> Chatear con Soporte
            </a>
          </div>

          {/* Styled Google Maps Embed */}
          <div className="card-premium">
            <img
              src="src/assets/ubicacion.png"
              className="w-full h-full border-0 rounded-lg"
            />
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="card-premium p-6 md:p-10">
          {!isSubmitted ? (
            <>
              <h2 className="text-[1.5rem] font-extrabold uppercase text-text-primary border-b border-border-brand/40 pb-3 mb-6 font-title">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Nombre Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="bg-primary/80 border border-border-brand/60 text-text-primary py-3.5 px-4 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <span className="text-red-500 text-[0.8rem]">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-primary/80 border border-border-brand/60 text-text-primary py-3.5 px-4 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="text-red-500 text-[0.8rem]">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="bg-primary/80 border border-border-brand/60 text-text-primary py-3.5 px-4 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    placeholder="Ej. +51 987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="bg-primary/80 border border-border-brand/60 text-text-primary py-3.5 px-4 rounded-lg text-[0.95rem] transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    placeholder="¿En qué te podemos ayudar?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[0.8rem] font-bold uppercase text-text-secondary tracking-wider">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    className="bg-primary/80 border border-border-brand/60 text-text-primary py-3.5 px-4 rounded-lg text-[0.95rem] min-h-[140px] resize-y transition-all duration-300 outline-none focus:border-accent focus:shadow-glow-accent"
                    placeholder="Escribe tu consulta detallada aquí..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-[0.8rem]">{errors.message}</span>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full h-12 cursor-pointer"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaPaperPlane /> Enviar Mensaje
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10 px-5 flex flex-col items-center gap-4 animate-[fadeIn_0.4s_ease-out]">
              <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent text-accent flex items-center justify-center text-[2rem] mb-2 shadow-glow">
                <FaCheckCircle />
              </div>
              <h2 className="text-[1.5rem] font-extrabold uppercase text-text-primary font-title">¡Mensaje Enviado!</h2>
              <p className="text-text-secondary max-w-[380px] mb-3">
                Tu consulta ha sido enviada con éxito. Nuestro equipo se pondrá en contacto contigo a la brevedad.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary mt-3"
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
