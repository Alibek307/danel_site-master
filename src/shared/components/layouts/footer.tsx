import { Link } from '@tanstack/react-router';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { m } from 'src/paraglide/messages';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='border-t bg-background mt-auto'>
            <div className='container mx-auto px-6 py-8'>
                <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8'>
                    {/* О компании */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Danel</h3>
                        <p className='text-sm text-muted-foreground mb-4'>
                            Система заказа продкутов для бизнеса. Качественная продукция с доставкой.
                        </p>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Контакты</h3>
                        <div className='sapce-y-3'>
                            <a
                                href="tel:+77001234567"
                                className='flex items-center gap-2 text-sm text-muted-foregound hover:text-primary transition-colors'
                            >
                                <Phone className='w-4 h-4' />
                                +7 (700) 123-45-67
                            </a>
                            <a
                                href="malito:info@danel.kz"
                                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
                            >
                                <Mail className='w-4 h-4' />
                                info@danel.kz
                            </a>
                            <a
                                href="https://www.instagram.com/pirogi_danel_astana/"
                                target="_blank"
                                rel='noopener onreferrer'
                                className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors'
                            >
                                <Instagram className='w-4 h-4' />
                                @danel.kz
                            </a>
                        </div>
                    </div>

                    {/* Адрес */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Адрес</h3>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <MapPin className='w-4 h-4' />
                            <span>Казахстан, г. Астана, ул. Сыганак 54а, БЦ "А"</span>
                        </div>
                    </div>

                    { /* Навигация */}
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Навигация</h3>
                        <div className='space-y-2'>
                            <Link
                                to="/"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Главная
                            </Link>
                            <Link
                                to="/orders"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Мои заказы
                            </Link>
                            <Link
                                to="/auth/register"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Регистрация
                            </Link>
                            <Link
                                to="/auth/login"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Вход
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className='mt-8 pt-6 border-t text-center text-sm text-muted-foreground'>
                    <p>© {currentYear} Danel. Все права защищены.</p>
                </div>
            </div>
        </footer>
    )
}