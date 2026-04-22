import { Code, Palette, Server, Github, Mail, Heart } from 'lucide-react';

const TEAM = [
  {
    name: 'Запьянцев Олег',
    role: 'Тимлид + Fullstack',
    description: 'Архитектура, бэкенд и координация команды',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Вепрева Анастасия',
    role: 'UI дизайнер + Frontend',
    description: 'Дизайн интерфейса и фронтенд разработка',
    icon: Palette,
    color: 'from-pink-500 to-purple-500',
  },
  {
    name: 'Герасимова Анна',
    role: 'Frontend + Backend',
    description: 'Фронтенд компоненты и серверная логика',
    icon: Server,
    color: 'from-emerald-500 to-teal-500',
  },
];

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-3xl">💰</span>
        </div>
        <h1 className="mb-3">Мои финансы</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Современное приложение для управления личными финансами студентов
        </p>
        <p className="text-sm text-muted-foreground mt-2">Версия 1.0.0</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
        <h2 className="mb-4 text-center">О приложении</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            <span style={{ fontWeight: '600' }} className="text-foreground">Мои финансы</span> — это современный
            и дружелюбный инструмент для студентов, которые хотят контролировать свой бюджет
            и научиться грамотно управлять деньгами.
          </p>
          <p>
            Приложение помогает отслеживать доходы и расходы, анализировать траты по категориям,
            получать умные подсказки и прогнозировать остаток средств на основе текущих привычек.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-sm" style={{ fontWeight: '600' }}>Аналитика</p>
            <p className="text-xs text-muted-foreground mt-1">
              Визуализация расходов
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">💡</p>
            <p className="text-sm" style={{ fontWeight: '600' }}>Умные советы</p>
            <p className="text-xs text-muted-foreground mt-1">
              Персональные рекомендации
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">🔮</p>
            <p className="text-sm" style={{ fontWeight: '600' }}>Прогнозы</p>
            <p className="text-xs text-muted-foreground mt-1">
              Планирование бюджета
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
        <h2 className="mb-6 text-center">Команда разработчиков</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((member) => {
            const Icon = member.icon;
            return (
              <div key={member.name} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2" style={{ fontWeight: '600' }}>
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200 p-8">
        <h3 className="mb-4 text-center">Возможности приложения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Учёт транзакций</p>
              <p className="text-sm text-muted-foreground">
                Добавление доходов и расходов
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Контроль бюджета</p>
              <p className="text-sm text-muted-foreground">
                Установка лимитов и отслеживание
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Импорт из CSV</p>
              <p className="text-sm text-muted-foreground">
                Загрузка банковских выписок
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Прогнозирование</p>
              <p className="text-sm text-muted-foreground">
                Расчёт остатка средств
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Совместный бюджет</p>
              <p className="text-sm text-muted-foreground">
                Управление финансами вместе
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <p style={{ fontWeight: '600' }}>Telegram-бот</p>
              <p className="text-sm text-muted-foreground">
                Быстрое добавление расходов
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <p className="text-muted-foreground">Сделано с любовью для студентов</p>
        </div>

<div className="flex items-center justify-center gap-4 flex-wrap">
  {/* GitHub ссылка */}
  <a
    href="https://github.com/W0LIF/psuti_olimp"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
  >
    <Github className="w-4 h-4" />
    <span className="text-sm">GitHub</span>
  </a>

  {/* Поддержка с выпадающим меню */}
  <div className="relative group">
    <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
      <Mail className="w-4 h-4" />
      <span className="text-sm">Поддержка</span>
    </button>
    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 min-w-[200px] z-10 border border-gray-200 dark:border-gray-700">
      <a 
        href="https://mail.google.com/mail/?view=cm&fs=1&to=gerasimovaanna258@gmail.com&su=Вопрос%20о%20финансовом%20дашборде&body=Здравствуйте!%20У%20меня%20есть%20вопрос..." 
        target="_blank" 
        rel="noopener noreferrer"
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        📧 Gmail
      </a>
      <a 
        href="https://mail.yandex.ru/compose?to=gerasimovaanna258@gmail.com&subject=Вопрос%20о%20финансовом%20дашборде&body=Здравствуйте!%20У%20меня%20есть%20вопрос..." 
        target="_blank" 
        rel="noopener noreferrer"
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        📧 Яндекс Почта
      </a>
      <a 
        href="mailto:gerasimovaanna258@gmail.com?subject=Вопрос%20о%20финансовом%20дашборде&body=Здравствуйте!%20У%20меня%20есть%20вопрос..."
        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        📧 Почта (приложение)
      </a>
    </div>
  </div>
</div>

        <p className="text-xs text-muted-foreground mt-6">
          © 2026 Мои финансы. Все права защищены.
        </p>
      </div>
    </div>
  );
}
