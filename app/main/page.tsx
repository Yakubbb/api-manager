'use client'
import { useEffect, useState, useRef } from "react";
import { getUserDataForFront, updateUserData } from "@/server-side/database-handler";
import { FaTelegramPlane, FaArrowRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Link from "next/link";
import { sendLetter } from "@/server-side/mail-server";

function MainMenuElement({ name, href, description }: { name: string, href: string, description: string }) {
  return (
    <Link href={href} className="group bg-white flex flex-col border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex flex-row justify-between font-semibold text-xl items-center text-gray-800">
        {name}
        <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1 text-gray-400 group-hover:text-[#7242f5]" />
      </div>
      <div className="mt-3 rounded-lg border border-indigo-100 p-4 text-[#7242f5] text-sm bg-indigo-50 font-medium">
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
  const initialEmail = useRef<string>(''); // Используем useRef для хранения изначального email

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [imageError, setImageError] = useState<string>();


  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeVerificationError, setCodeVerificationError] = useState('');

  const [corrVer, setCorrver] = useState('');

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await getUserDataForFront();
      if (data) {
        setUserData(data);
        initialEmail.current = data.email; // Сохраняем изначальный email
        setFormData({
          name: data.name,
          email: data.email
        });
        setImagePreviewUrl(data.image);
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
    setSaveSuccess(false);
    setSaveError('');

    // Если email меняется, сбрасываем статус верификации
    if (id === 'email' && value !== userData.email) {
      setUserData(prev => ({ ...prev, emailVerified: false }));
      setVerificationSent(false); // Сбрасываем отправку письма
      setVerificationCode(''); // Сбрасываем код
      setCodeVerificationError(''); // Сбрасываем ошибку кода
      setVerificationError(''); // Сбрасываем ошибку отправки
    }
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

    // Проверяем, изменился ли email и не подтвержден ли он
    if (formData.email !== initialEmail.current && !userData.emailVerified) {
      setSaveError('Пожалуйста, подтвердите новую электронную почту.');
      setIsSaving(false);
      return;
    }

    try {
      await updateUserData(formData.name, formData.email, selectedImage);
      setUserData(prev => ({ ...prev, name: formData.name, email: formData.email, emailVerified: userData.emailVerified }));
      initialEmail.current = formData.email; // Обновляем изначальный email после сохранения
      setSaveSuccess(true);
      if (selectedImage) {
        const data = await getUserDataForFront();
        setImagePreviewUrl(data.image)
      }
      setSelectedImage(undefined)

    } catch (error: any) {
      setSaveError('Не удалось сохранить изменения. Попробуйте снова.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);
    setVerificationError('');
    setVerificationSent(false);
    setCodeVerificationError('');
    setVerificationCode('');

    try {
      const verificationCode = await sendLetter(formData.email); // Отправляем на email из formData
      setCorrver(verificationCode);
      setVerificationSent(true);
    } catch (error) {
      setVerificationError('Не удалось отправить письмо для подтверждения.');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifyingCode(true);
    setCodeVerificationError('');
    
    if (verificationCode === corrVer) {
      setUserData(prev => ({ ...prev, emailVerified: true }));
      setVerificationSent(false);
      setVerificationCode('');
    } else {
      setCodeVerificationError('Неверный код верификации. Попробуйте снова.');
    }
    setIsVerifyingCode(false);
  };

  // Определяем, нужно ли показывать блок верификации
  const shouldShowVerification = formData.email !== initialEmail.current && !userData.emailVerified;

  return (
    <section className="flex flex-col lg:flex-row h-full w-full p-4 gap-6 bg-slate-50 min-h-screen">

      <div className="flex flex-col w-full lg:w-1/2 space-y-6">
        <div className="flex-grow flex flex-col bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Ваш профиль</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аватар</label>
              <div className="flex items-center gap-4">
                <img
                  src={imagePreviewUrl || '/default-avatar.png'}
                  alt="Аватар"
                  className="w-24 h-24 rounded-full object-cover bg-gray-200 border-4 border-[#7242f5] shadow-md transform transition-transform hover:scale-105 duration-300"
                  onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                />
                <label htmlFor="image-upload" className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-[#7242f5] font-semibold py-2 px-4 border border-indigo-200 rounded-lg shadow-sm transition-colors duration-200">
                  Изменить фото
                </label>
                <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
              </div>
              {imageError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><FaExclamationCircle />{imageError}</p>}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя пользователя</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] text-base"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Электронная почта</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] text-base"
                value={formData.email}
                onChange={handleChange}
              />
              {formData.email === initialEmail.current && userData.emailVerified && (
                <p className="text-sm font-medium text-green-700 flex items-center gap-2 mt-2"><FaCheckCircle className="text-green-500" />Почта подтверждена.</p>
              )}
            </div>
          </div>

          {shouldShowVerification && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col gap-4 animate-fadeIn">
              {!verificationSent ? (
                <>
                  <p className="text-sm font-medium text-yellow-800 flex items-center gap-2"><FaExclamationCircle className="text-yellow-600" />Новая почта не подтверждена. Подтвердите для сохранения.</p>
                  <button
                    className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSendVerificationEmail}
                    disabled={isSendingVerification}
                  >
                    {isSendingVerification ? 'Отправка...' : 'Подтвердить почту'}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-green-800 flex items-center gap-2 animate-bounceIn"><FaCheckCircle />Письмо для подтверждения успешно отправлено! Введите код из письма.</p>
                  <input
                    type="text"
                    placeholder="Введите код"
                    className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#7242f5] focus:border-[#7242f5] text-base"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setCodeVerificationError('');
                    }}
                    disabled={isVerifyingCode}
                  />
                  {codeVerificationError && <p className="text-red-500 text-xs flex items-center gap-1 animate-shake"><FaExclamationCircle />{codeVerificationError}</p>}
                  <button
                    className="bg-[#7242f5] hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleVerifyCode}
                    disabled={isVerifyingCode || verificationCode.length === 0}
                  >
                    {isVerifyingCode ? 'Проверка...' : 'Подтвердить код'}
                  </button>
                </div>
              )}
              {verificationError && <div className="text-red-600 text-sm mt-2 flex items-center gap-1 animate-shake"><FaExclamationCircle />{verificationError}</div>}
            </div>
          )}


          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-6">
              {saveSuccess && <div className="text-green-600 font-medium text-sm flex items-center gap-1 animate-bounceIn"><FaCheckCircle />Изменения успешно сохранены!</div>}
              {saveError && <div className="text-red-600 font-medium text-sm flex items-center gap-1 animate-shake"><FaExclamationCircle />{saveError}</div>}
            </div>
            <button
              className="w-full sm:w-auto bg-[#7242f5] hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7242f5] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              onClick={handleSave}
              disabled={isSaving || (formData.email !== initialEmail.current && !userData.emailVerified)}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>


      </div>

      <div className="flex flex-col w-full lg:w-1/2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-900">Полезные ссылки</h2>
          <MainMenuElement name="Примеры" href="/main/preview/" description="Варианты использования и интеграций для ваших продуктов" />
          <MainMenuElement name="Новый чат" href="/main/support/" description="Начните чат" />
        </div>
      </div>
    </section>
  );
}