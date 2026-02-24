import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { submitContact } from '@/lib/api';
import { ContactSEO } from '@/components/SEO';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitContact({
        ...formData,
        language: i18n.language,
      });
      setSubmitted(true);
      toast.success(t('contact.form.success'));
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact submission failed:', error);
      toast.error(t('contact.form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 md:pt-32" data-testid="contact-page">
      {/* SEO */}
      <ContactSEO lang={i18n.language} />
      
      {/* Header */}
      <section className="orso-container py-12 md:py-20">
        <div className="max-w-3xl">
          <p className="orso-caption mb-4">{t('contact.tagline')}</p>
          <h1 className="orso-h1 mb-6" data-testid="contact-title">
            {t('contact.title')}
          </h1>
          <p className="orso-body">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="orso-section pt-0">
        <div className="orso-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <div>
              {submitted ? (
                <div
                  className="bg-orso-surface p-12 text-center"
                  data-testid="contact-success"
                >
                  <div className="w-16 h-16 bg-[#2e2e2e] text-white flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="orso-h3 mb-4">{t('contact.form.success')}</h3>
                  <p className="orso-body">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="orso-btn-secondary mt-8"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-testid="contact-form"
                >
                  <div>
                    <Label htmlFor="name" className="orso-caption mb-2 block">
                      {t('contact.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="orso-input"
                      placeholder="Jean Dupont"
                      data-testid="contact-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="orso-caption mb-2 block">
                      {t('contact.form.email')} *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="orso-input"
                      placeholder="jean@exemple.com"
                      data-testid="contact-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="orso-caption mb-2 block">
                      {t('contact.form.phone')}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="orso-input"
                      placeholder="+33 6 00 00 00 00"
                      data-testid="contact-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="orso-caption mb-2 block">
                      {t('contact.form.subject')} *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="orso-input"
                      placeholder="Demande de renseignements"
                      data-testid="contact-subject"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="orso-caption mb-2 block">
                      {t('contact.form.message')} *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="orso-input min-h-[150px]"
                      placeholder="Votre message..."
                      data-testid="contact-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="orso-btn-primary"
                    disabled={submitting}
                    data-testid="contact-submit"
                  >
                    {submitting ? (
                      t('common.loading')
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-orso-surface p-8 md:p-12 mb-8">
                <h3 className="orso-h3 mb-8">{t('contact.info.title')}</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="orso-caption mb-1">Adresse</p>
                      <p className="text-gray-600">
                        Sainte Lucie de Porto Vecchio<br />
                        Corse du Sud, France
                      </p>
                      <a
                        href="https://share.google/AJqwlTVKrw5cqQIyD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2e2e2e] hover:underline text-sm mt-2 inline-block"
                        data-testid="contact-gmb-link"
                      >
                        Voir sur Google Maps →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="orso-caption mb-1">Téléphone</p>
                      <a
                        href="tel:+33615875470"
                        className="text-gray-600 hover:text-[#2e2e2e] transition-colors"
                        data-testid="contact-phone-link"
                      >
                        +33 6 15 87 54 70
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="orso-caption mb-1">Email</p>
                      <a
                        href="mailto:contact@orso-rs.com"
                        className="text-gray-600 hover:text-[#2e2e2e] transition-colors"
                        data-testid="contact-email-link"
                      >
                        contact@orso-rs.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendly Embed Placeholder */}
              <div className="bg-white border border-gray-100 p-8 md:p-12">
                <h3 className="orso-h3 mb-4">Réservez un appel</h3>
                <p className="orso-body mb-6">
                  Échangeons pendant 30 minutes sur votre projet de location ou de
                  séjour. Un moment dédié pour répondre à vos questions et vous
                  proposer un accompagnement sur mesure.
                </p>
                <div className="aspect-video bg-orso-surface flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    Calendly - Intégration disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
