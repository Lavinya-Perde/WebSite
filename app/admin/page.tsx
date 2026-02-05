"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ImageFile {
    name: string;
    path: string;
    url: string;
    size: number;
    uploadedAt?: string;
}

const services = [
    { id: 'slider', name: 'Ana Sayfa Slider', folder: 'slider', type: 'homepage' },
    { id: 'gallery', name: 'Ana Sayfa Galeri', folder: 'gallery', type: 'homepage' },
    { id: 'fon-perde', name: 'Fon Perde', folder: 'fon-perde', type: 'service' },
    { id: 'tul-perde', name: 'Tül Perde', folder: 'tul-perde', type: 'service' },
    { id: 'stor-perde', name: 'Stor Perde', folder: 'stor-perde', type: 'service' },
    { id: 'hali', name: 'Halı', folder: 'hali', type: 'service' },
    { id: 'duvar-kagidi', name: 'Duvar Kağıdı', folder: 'duvar-kagidi', type: 'service' },
    { id: 'montaj', name: 'Montaj Hizmeti', folder: 'montaj', type: 'service' },
];

export default function AdminPanel() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('slider');
    const [images, setImages] = useState<Record<string, ImageFile[]>>({});
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tüm görselleri yükle
    const loadAllImages = useCallback(async () => {
        console.log('=== Loading all images ===');
        const allImages: Record<string, ImageFile[]> = {};

        for (const service of services) {
            try {
                console.log(`Fetching images for: ${service.name} (${service.folder})`);
                const response = await fetch(`/api/images?service=${service.folder}`);
                console.log(`Response status for ${service.folder}:`, response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Images loaded for ${service.folder}:`, data.images?.length || 0);
                    allImages[service.folder] = data.images || [];
                } else {
                    console.error(`Failed to load ${service.folder}:`, response.status);
                    allImages[service.folder] = [];
                }
            } catch (error) {
                console.error(`Error loading images for ${service.name}:`, error);
                allImages[service.folder] = [];
            }
        }

        console.log('All images loaded:', allImages);
        setImages(allImages);
    }, []);

    // Auth kontrolü
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();
                if (data.valid === true) {
                    setIsLoggedIn(true);
                    loadAllImages();
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router, loadAllImages]);

    // Dosya yükleme
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        console.log('=== Client Upload Started ===');
        console.log('Active tab:', activeTab);
        console.log('Files selected:', files.length);
        Array.from(files).forEach((file, i) => {
            console.log(`File ${i + 1}:`, file.name, 'Size:', file.size, 'Type:', file.type);
        });

        setUploading(true);
        const formData = new FormData();
        formData.append('service', activeTab);

        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        console.log('FormData created, sending to /api/upload...');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Upload response:', data);

            if (response.ok) {
                // Biraz bekle ve sonra görselleri yeniden yükle
                setTimeout(async () => {
                    await loadAllImages();
                    showNotification(`${data.files?.length || 0} görsel başarıyla yüklendi!`, 'success');
                }, 500);
            } else {
                console.error('Upload failed:', data);
                showNotification(data.error || 'Yükleme sırasında hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showNotification('Yükleme sırasında hata oluştu!', 'error');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    // Dosya silme
    const handleDelete = async (imageName: string, imageUrl: string) => {
        if (deleteConfirm !== imageName) {
            setDeleteConfirm(imageName);
            setTimeout(() => setDeleteConfirm(null), 3000);
            return;
        }

        try {
            const response = await fetch('/api/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: activeTab,
                    filename: imageName,
                    url: imageUrl
                }),
            });

            if (response.ok) {
                await loadAllImages();
                setDeleteConfirm(null);
                showNotification('Görsel başarıyla silindi!', 'success');
            } else {
                const data = await response.json();
                showNotification(data.error || 'Silme sırasında hata oluştu!', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Silme sırasında hata oluştu!', 'error');
        }
    };

    // Bildirim kapat
    const closeNotification = () => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
            notificationTimeoutRef.current = null;
        }
        setNotification(null);
    };

    // Bildirim göster
    const showNotification = (message: string, type: 'success' | 'error') => {
        // Önceki timeout'u temizle
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }

        setNotification({ message, type });

        // 3 saniye sonra otomatik kapat
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, 3000);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Yükleniyor...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null;
    }

    const currentImages = images[activeTab] || [];

    // Toplam kullanılan alanı hesapla
    const totalUsedBytes = Object.values(images).flat().reduce((sum, img) => sum + (img.size || 0), 0);
    const totalLimitGB = 25;
    const totalUsedGB = totalUsedBytes / (1024 * 1024 * 1024);
    const usagePercent = Math.min((totalUsedGB / totalLimitGB) * 100, 100);
    const totalImageCount = Object.values(images).flat().length;

    const formatSize = (bytes: number) => {
        if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <div className="admin-panel">
            {/* Notification Popup */}
            {notification && (
                <div className="popup-overlay" onClick={closeNotification}>
                    <div className={`popup ${notification.type}`} onClick={(e) => e.stopPropagation()}>
                        <div className="popup-icon">
                            {notification.type === 'success' ? '✓' : '✕'}
                        </div>
                        <h3>{notification.type === 'success' ? 'Başarılı!' : 'Hata!'}</h3>
                        <p>{notification.message}</p>
                        <button onClick={closeNotification} className="popup-close" type="button">
                            Tamam
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Admin Paneli</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Çıkış Yap
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="admin-content">
                {/* Tabs */}
                <div className="service-tabs">
                    {services.map(service => (
                        <button
                            key={service.id}
                            className={`tab-btn ${activeTab === service.folder ? 'active' : ''}`}
                            onClick={() => setActiveTab(service.folder)}
                        >
                            {service.name}
                            <span className="badge">{images[service.folder]?.length || 0}</span>
                        </button>
                    ))}
                </div>

                {/* Storage Info */}
                <div className="storage-info">
                    <div className="storage-text">
                        <span className="storage-label">{formatSize(totalUsedBytes)} / {totalLimitGB} GB kullanıldı</span>
                        <span className="storage-count">{totalImageCount} görsel</span>
                    </div>
                    <div className="storage-bar">
                        <div className="storage-fill" style={{ width: `${usagePercent}%` }}></div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="upload-section">
                    <label className="upload-btn">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        {uploading ? 'Yükleniyor...' : '+ Yeni Görsel Ekle'}
                    </label>
                    <p className="upload-info">
                        {services.find(s => s.folder === activeTab)?.name} için görsel yükleyin
                    </p>
                </div>

                {/* Images Grid */}
                <div className="images-grid">
                    {currentImages.length === 0 ? (
                        <div className="empty-state">
                            <p>Henüz görsel yüklenmedi</p>
                        </div>
                    ) : (
                        currentImages.map((img, index) => (
                            <div key={img.name} className="image-card">
                                <div className="image-wrapper">
                                    <Image
                                        src={img.path}
                                        alt={img.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="300px"
                                    />
                                </div>
                                <div className="image-info">
                                    <p className="image-name">{img.name}</p>
                                    <p className="image-size">{(img.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <button
                                    className={`delete-btn ${deleteConfirm === img.name ? 'confirm' : ''}`}
                                    onClick={() => handleDelete(img.name, img.url || img.path)}
                                >
                                    {deleteConfirm === img.name ? 'Emin misiniz?' : '🗑️ Sil'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease-out;
                }

                .popup {
                    background: #1a1a1a;
                    border-radius: 24px;
                    padding: 3rem 2rem;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 2px solid;
                }

                .popup.success {
                    border-color: #10b981;
                }

                .popup.error {
                    border-color: #ef4444;
                }

                .popup-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: bold;
                    animation: scaleIn 0.5s ease-out 0.2s both;
                }

                .popup.success .popup-icon {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                .popup.error .popup-icon {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                }

                .popup h3 {
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: #ffffff;
                }

                .popup.success h3 {
                    color: #10b981;
                }

                .popup.error h3 {
                    color: #ef4444;
                }

                .popup p {
                    color: #b0b0b0;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .popup-close {
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    border: none;
                    padding: 1rem 3rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    width: 100%;
                }

                .popup-close:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(139, 102, 158, 0.4);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes popIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }

                .loading-screen {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #0a0a0a;
                    color: #b0b0b0;
                    gap: 1rem;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #1a1a1a;
                    border-top: 4px solid #8b669e;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .admin-panel {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: #ffffff;
                }

                .admin-header {
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(139, 102, 158, 0.2);
                    padding: 1.5rem 2rem;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    box-shadow: 0 2px 20px rgba(139, 102, 158, 0.3);
                }

                .admin-header-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .admin-header h1 {
                    font-size: 1.8rem;
                    background: linear-gradient(135deg, #b89dd4 0%, #8b669e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .storage-info {
                    background: #1a1a1a;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .storage-text {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .storage-label {
                    color: #b89dd4;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .storage-count {
                    color: #666;
                    font-size: 0.85rem;
                }

                .storage-bar {
                    width: 100%;
                    height: 8px;
                    background: #2a2a2a;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .storage-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #8b669e 0%, #b89dd4 100%);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                    min-width: 2px;
                }

                .logout-btn {
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .logout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(139, 102, 158, 0.4);
                }

                .admin-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .service-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .tab-btn {
                    background: #1a1a1a;
                    color: #b0b0b0;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .tab-btn:hover {
                    border-color: #8b669e;
                    color: #b89dd4;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    border-color: #8b669e;
                }

                .badge {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                }

                .tab-btn.active .badge {
                    background: rgba(255, 255, 255, 0.3);
                }

                .upload-section {
                    background: #1a1a1a;
                    border: 2px dashed rgba(139, 102, 158, 0.3);
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .upload-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #8b669e 0%, #6d5380 100%);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                }

                .upload-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(139, 102, 158, 0.4);
                }

                .upload-info {
                    margin-top: 1rem;
                    color: #b0b0b0;
                    font-size: 0.9rem;
                }

                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #666;
                }

                .image-card {
                    background: #1a1a1a;
                    border: 1px solid rgba(139, 102, 158, 0.2);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s;
                }

                .image-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(139, 102, 158, 0.3);
                    border-color: #8b669e;
                }

                .image-wrapper {
                    position: relative;
                    width: 100%;
                    padding-bottom: 100%;
                    background: #0a0a0a;
                }

                .image-info {
                    padding: 1rem;
                }

                .image-name {
                    color: #ffffff;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .image-size {
                    color: #666;
                    font-size: 0.85rem;
                }

                .delete-btn {
                    width: 100%;
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .delete-btn:hover {
                    background: #c82333;
                }

                .delete-btn.confirm {
                    background: #ff4444;
                    animation: pulse 0.5s ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @media (max-width: 768px) {
                    .admin-header-content {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .service-tabs {
                        gap: 0.5rem;
                    }

                    .tab-btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.9rem;
                    }

                    .images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
