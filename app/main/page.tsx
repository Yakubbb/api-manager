'use client'
import { useEffect, useState } from "react";
import { getUserDataForFront, updateUserData } from "@/server-side/database-handler";
import { FaTelegramPlane, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { sendLetter } from "@/server-side/mail-server";

// Улучшенный компонент навигационного элемента меню
function MainMenuElement({ name, href, description }: { name: string, href: string, description: string }) {
  return (
    <Link href={href} className="group bg-white flex flex-col border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex flex-row justify-between font-semibold text-xl items-center text-gray-800">
        {name}
        <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1 text-gray-400 group-hover:text-indigo-500" />
      </div>
      <div className="mt-3 rounded-lg border border-indigo-100 p-4 text-indigo-800 text-sm bg-indigo-50 font-medium">
        {description}
      </div>
    </Link>
  )
}

export default function MainPageDefault() {
  const [userData, setUserData] = useState<{ role: string, name: string, id: any, email: string, image?: string, emailVerified?: boolean }>({ role: '', name: '', id: null, email: '', image: '', emailVerified: false });
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [imageError, setImageError] = useState<string>();
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await getUserDataForFront();
      if (data) {
        setUserData(data);
        setImagePreviewUrl(data.image);
        setFormData({
          name: data.name,
          email: data.email
        });
      }
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const newPreviewUrl = URL.createObjectURL(selectedImage);
      setImagePreviewUrl(newPreviewUrl);
      return () => URL.revokeObjectURL(newPreviewUrl);
    } else {
      setImagePreviewUrl(userData.image || undefined);
    }
  }, [selectedImage, userData.image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Сбрасываем сообщения при изменении данных
    setSaveSuccess(false);
    setSaveError('');
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(undefined);
    setSaveSuccess(false);

    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];

      if (imageFile.size > MAX_IMAGE_SIZE) {
        setImageError("Размер файла не должен превышать 2 МБ.");
        return;
      }

      if (!['image/png', 'image/jpeg', 'image/webp'].includes(imageFile.type)) {
        setImageError("Допускаются только изображения PNG, JPG или WEBP.");
        return;
      }
      setSelectedImage(imageFile);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    if (imageError) {
      setIsSaving(false);
      return;
    }

    try {
      await updateUserData(formData.name, formData.email, selectedImage);
      setUserData(prev => ({ ...prev, name: formData.name, email: formData.email }));
      setSaveSuccess(true);
      // Если было выбрано новое изображение, обновим `userData.image` после успешной загрузки
      // Это потребует от `updateUserData` возвращать новый URL изображения
      if (selectedImage) {
          const data = await getUserDataForFront(); // Получаем свежие данные
          setImagePreviewUrl(data.image)
      }
      setSelectedImage(undefined) // Сбрасываем выбранный файл

    } catch (error: any) {
      setSaveError('Не удалось сохранить изменения. Попробуйте снова.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsSendingVerification(true);
    setVerificationError('');
    setVerificationSent(false);
    try {
      await sendLetter(userData.email, 'Код верификации'); // Можно передавать реальный код
      setVerificationSent(true);
    } catch (error) {
      setVerificationError('Не удалось отправить письмо для подтверждения.');
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row h-full w-full p-4 md:p-6 gap-6 bg-slate-50">
      
      {/* Левая колонка: Профиль пользователя */}
      <div className="flex flex-col w-full lg:w-1/2 space-y-6">
        <div className="flex-grow flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Ваш профиль</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аватар</label>
              <div className="flex items-center gap-4">
                <img
                  src={imagePreviewUrl || '/default-avatar.png'} // запасное изображение
                  alt="Аватар"
                  className="w-20 h-20 rounded-full object-cover bg-gray-200 border-2 border-white shadow-md"
                  onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} // обработка ошибки загрузки
                />
                <label htmlFor="image-upload" className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200">
                  Изменить фото
                </label>
                <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
              </div>
              {imageError && <p className="text-red-500 text-xs mt-2">{imageError}</p>}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя пользователя</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Блок верификации почты */}
          {!userData.emailVerified && formData.email && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm font-medium text-yellow-800">Ваша почта не подтверждена.</p>
                <button
                    className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleVerifyEmail}
                    disabled={isSendingVerification}
                >
                    {isSendingVerification ? 'Отправка...' : 'Подтвердить почту'}
                </button>
            </div>
          )}
          {verificationSent && <div className="text-green-600 text-sm mt-2">Письмо для подтверждения успешно отправлено!</div>}
          {verificationError && <div className="text-red-600 text-sm mt-2">{verificationError}</div>}


          {/* Кнопки управления */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-6">
                {saveSuccess && <div className="text-green-600 font-medium text-sm">Изменения успешно сохранены!</div>}
                {saveError && <div className="text-red-600 font-medium text-sm">{saveError}</div>}
            </div>
            <button
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
        
        <div className="flex flex-row gap-4">
          <Link href={'/main'} className="group flex-1 hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-4 text-indigo-500 hover:text-indigo-600">
            <FaTelegramPlane size={40} />
            <span className="ml-3 font-semibold text-lg text-gray-700 group-hover:text-indigo-600">Интеграция</span>
          </Link>
        </div>
      </div>

      {/* Правая колонка: Навигация */}
      <div className="flex flex-col w-full lg:w-1/2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Полезно</h2>
          <MainMenuElement name="Примеры" href="/main/preview/" description="Варианты использования и интеграций для ваших продуктов" />
          {/* Здесь можно добавить другие элементы MainMenuElement */}
        </div>
      </div>
    </section>
  );
}