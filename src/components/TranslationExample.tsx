'use client';

import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

const TranslationExample = () => {
  const t = useTranslations('common');
  const tTasks = useTranslations('tasks');
  const tPomodoro = useTranslations('pomodoro');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('welcome')}</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{tTasks('title')}</h2>
          <p>{tTasks('createNew')}</p>
          <div className="mt-2 space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {tTasks('completed')}
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
              {tTasks('pending')}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {tTasks('inProgress')}
            </span>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{tPomodoro('title')}</h2>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              {tPomodoro('start')}
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              {tPomodoro('pause')}
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              {tPomodoro('reset')}
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Common Actions:</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              {t('save')}
            </button>
            <button className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
              {t('cancel')}
            </button>
            <button className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600">
              {t('submit')}
            </button>
            <button className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
              {t('delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationExample;
