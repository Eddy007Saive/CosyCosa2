import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { submitContact, getSiteImages } from '@/lib/api';
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
  const [contactImage, setContactImage] = useState('https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const data = await getSiteImages();
        if (data.images?.contact_page) {
          setContactImage(data.images.contact_page);
        }
      } catch (error) {
        console.error('Error loading contact image:', error);
      }
    };
    loadImage();
  }, []);

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
    <div className="pt-20" data-testid="contact-page">
      {/* SEO */}
      <ContactSEO lang={i18n.language} />
      
      {/* Main Section - Split Layout */}
      <section className="min-h-screen bg-[#f5f5f3]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left - Image */}
          <div className="relative h-[40vh] lg:h-auto lg:min-h-screen">
            <img
              src={contactImage}
              alt="Contact ORSO RS"
              className="w-full h-full object-cover"
              data-testid="contact-image"
            />
          </div>

          {/* Right - Form */}
          <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
            <div className="w-full max-w-lg">
              {/* Header */}
              <div className="mb-10">
                <div className="w-12 h-px bg-[#2e2e2e] mb-6" />
                <h1 className="font-serif text-3xl md:text-4xl text-[#2e2e2e] mb-4" data-testid="contact-title">
                  {t('contact.title')}
                </h1>
                <p className="text-gray-600 font-light">
                  {t('contact.subtitle')}
                </p>
              </div>

              {/* Contact Info - Compact */}
              <div className="flex flex-wrap gap-6 mb-10 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Adresse</p>
                  <p className="text-[#2e2e2e]">Sainte Lucie de Porto Vecchio</p>
                  <p className="text-gray-600">Corse du Sud, France</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Téléphone</p>
                  <a href="tel:+33615875470" className="text-[#2e2e2e] hover:underline">
                    +33 6 15 87 54 70
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
                  <a href="mailto:contact@orso-rs.com" className="text-[#2e2e2e] hover:underline">
                    contact@orso-rs.com
                  </a>
                </div>
              </div>

              {/* Form */}
              {submitted ? (
                <div
                  className="bg-white p-10 text-center shadow-sm"
                  data-testid="contact-success"
                >
                  <div className="w-14 h-14 bg-[#2e2e2e] text-white flex items-center justify-center mx-auto mb-6 rounded-full">
                    <Check className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#2e2e2e] mb-3">Message envoyé</h3>
                  <p className="text-gray-600 mb-6">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="orso-btn-secondary"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-8 md:p-10 shadow-sm"
                  data-testid="contact-form"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-0 h-12 rounded-none focus:ring-1 focus:ring-[#2e2e2e]"
                        placeholder={t('contact.form.name')}
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-0 h-12 rounded-none focus:ring-1 focus:ring-[#2e2e2e]"
                        placeholder={t('contact.form.email')}
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-50 border-0 h-12 rounded-none focus:ring-1 focus:ring-[#2e2e2e]"
                      placeholder={t('contact.form.phone')}
                      data-testid="contact-phone"
                    />
                  </div>

                  <div className="mb-4">
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-0 h-12 rounded-none focus:ring-1 focus:ring-[#2e2e2e]"
                      placeholder={t('contact.form.subject')}
                      data-testid="contact-subject"
                    />
                  </div>

                  <div className="mb-6">
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-0 min-h-[120px] rounded-none focus:ring-1 focus:ring-[#2e2e2e] resize-none"
                      placeholder={t('contact.form.message')}
                      data-testid="contact-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#5c6b5a] hover:bg-[#4a5849] text-white rounded-none uppercase tracking-widest text-xs font-medium transition-colors"
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
