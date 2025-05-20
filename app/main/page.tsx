'use client'
import { useEffect, useState } from "react";
import { getUserDataForFront, updateUserData } from "@/server-side/database-handler";
import { FaTelegramPlane } from "react-icons/fa";
import Link from "next/link";

function MainMenuElement({ name, href, description }: { name: string, href: string, description: string }) {
  return (
    <Link href={href} className="gap-2 bg-white flex flex-col border font-main2 w-full h-1/4 p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 border-gray-200">
      <div className="flex flex-row font-semibold text-xl items-center text-gray-800">
        {name}
      </div>
      <div className="rounded-xl border border-gray-300 p-4 text-gray-700 text-sm bg-[#e6e0f7] font-semibold">
        {description}
      </div>
    </Link>
  )
}


export default function MainPageDefault() {

  const [userData, setUserData] = useState<{ role: string, name: string, id: any, email: string, image?: string }>({ role: '', name: '', id: null, email: '', image: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [imageError, setImageError] = useState<string>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await getUserDataForFront();
      setUserData(data);
      setImagePreviewUrl(data.image)
      setFormData({
        name: data.name,
        email: data.email
      });
    }
    fetchDataAsync()

  }, [])


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
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(undefined);

    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];

      if (imageFile.size > MAX_IMAGE_SIZE) {
        setImageError("Image size exceeds the maximum allowed size (2MB).");
        setSelectedImage(undefined);
        setImagePreviewUrl(undefined);
        return;
      }

      if (imageFile.type !== 'image/png') {
        setImageError("Only PNG images are allowed.");
        setSelectedImage(undefined);
        setImagePreviewUrl(undefined);
        return;
      }

      setSelectedImage(imageFile);
    } else {
      setSelectedImage(undefined);
      setImagePreviewUrl(undefined);
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    setUploadProgress(0);

    try {
      if (imageError) {
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        image: selectedImage
      };

      await updateUserData(payload.name, payload.email, payload.image)

      setUserData(prev => ({ ...prev, name: formData.name, email: formData.email }));
    } catch (error: any) {

      setSaveError('сохранение не удалось');
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <section className="flex flex-row h-full w-full p-5 gap-5">
      <div className="flex flex-col justify-between h-full w-1/2">
        <div className="flex flex-col w-full h-min rounded-2xl border p-6 shadow-lg border-gray-200 bg-gray-50">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Привет!</h2>

          <div className="mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Аватар:</label>
            <input
              type="file"
              id="image"
              accept="image/png"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleImageChange}
            />
            {imageError && (
              <p className="text-red-500 text-sm mt-1">{imageError}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Никнейм:</label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Электронная почта:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.email}
              onChange={handleChange}
            />
          </div>


          <button
            className="bg-[#7242f5] hover:bg-[#5835d5] text-white font-bold py-2 px-4 rounded mt-4 focus:outline-none focus:shadow-outline disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              Загрузка: {uploadProgress}%
            </div>
          )}
          {saveError && (
            <div className="text-red-500 text-sm mt-2">{saveError}</div>
          )}
        </div>


        <div className="flex flex-row gap-2 h-1/6 rounded-xl border p-4">
          <Link href={'/main'} className="hover:shadow-lg transition duration-200 bg-[#f3f3f6] rounded-xl flex flex-row w-1/4 h-full justify-center items-center text-center border text-3xl text-[#7242f5]">
            <FaTelegramPlane size={60} />
          </Link>
        </div>
      </div>


      <div className="flex flex-col w-1/2 h-full rounded-2xl bg-[#f3f3f6] border p-5 space-y-4">
        <MainMenuElement name="Примеры" href="/main/preview/" description="Варианты использования и интеграций для ваших продуктов" />
        <MainMenuElement name="Настройки" href="/main/settings/" description="Персонализируйте свой профиль и настройте уведомления" />
        <MainMenuElement name="Поддержка" href="/main/support/" description="Получите помощь и ответы на свои вопросы" />
      </div>

    </section>
  );
}