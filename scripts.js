// دالة throttle لتحسين الأداء
function throttle(delay, fn) {
    let last = 0;
    return function(...args) {
        const now = Date.now();
        if (now - last >= delay) {
            fn.apply(this, args);
            last = now;
        }
    };
}

// دوال عارض الصور
function openImageViewer(src) {
    const viewer = document.getElementById('imageViewer');
    const expandedImage = document.getElementById('expandedImage');
    if (viewer && expandedImage) {
        expandedImage.src = src;
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
    }
}

function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto'; // إعادة تفعيل التمرير
    }
}

// دوال عارض الصور
function showImage(src) {
    const viewer = document.getElementById('imageViewer');
    const image = document.getElementById('expandedImage');
    if (viewer && image) {
        image.src = src;
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideImage() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// تهيئة عارض الصور عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const viewer = document.getElementById('imageViewer');
    
    // إغلاق العارض عند النقر خارج الصورة
    if (viewer) {
        viewer.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageViewer();
            }
        });
    }

    // إغلاق العارض عند الضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageViewer();
        }
    });

    // إضافة عارض الصور للصفحة إذا لم يكن موجوداً
    if (!document.getElementById('imageViewer')) {
        const viewer = document.createElement('div');
        viewer.id = 'imageViewer';
        viewer.className = 'image-viewer';
        viewer.onclick = hideImage;
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            hideImage();
        };
        
        const image = document.createElement('img');
        image.id = 'expandedImage';
        image.className = 'expanded-image';
        image.onclick = function(e) {
            e.stopPropagation();
        };
        
        viewer.appendChild(closeBtn);
        viewer.appendChild(image);
        document.body.appendChild(viewer);
    }

    // إضافة معالج النقر على الصور
    document.querySelectorAll('img').forEach(img => {
        if (!img.id || img.id !== 'expandedImage') {
            img.style.cursor = 'pointer';
            img.onclick = function() {
                showImage(this.src);
            };
        }
    });

    // إغلاق العارض عند الضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideImage();
        }
    });
});

// إضافة تأثير التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// إضافة تأثير ظهور العناصر عند التمرير
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
    observer.observe(elem);
});

// تحسين أداء الموقع
document.addEventListener('DOMContentLoaded', function() {
    // تحميل الصور بشكل متأخر مع تحسين الأداء
    const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    const tempImage = new Image();
                    tempImage.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    };
                    tempImage.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    lazyImageObserver.unobserve(img);
                }
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => lazyImageObserver.observe(img));

    // تحسين أداء التمرير
    let lastScrollPosition = window.scrollY;

    // دالة للتحقق من وجود العنصر في نطاق الرؤية
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    const scrollHandler = throttle(100, () => {
        const scrolled = window.scrollY;
        if (Math.abs(lastScrollPosition - scrolled) > 50) {
            lastScrollPosition = scrolled;
            // تحديث العناصر المرئية فقط
            document.querySelectorAll('.aos-animate').forEach(element => {
                if (!isElementInViewport(element)) {
                    element.classList.remove('aos-animate');
                }
            });
            
            document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('aos-animate');
                }
            });
        }
    });

    window.addEventListener('scroll', scrollHandler);

    // تحسين أداء المعرض
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const images = gallery.querySelectorAll('img');
        let loadedImages = 0;

        const showGallery = () => {
            if (loadedImages === images.length) {
                gallery.classList.add('loaded');
                AOS.refresh();
            }
        };

        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
                showGallery();
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    showGallery();
                });
            }
        });
    }

    // تحسين أداء الحركات
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        disable: window.innerWidth < 768
    });

    // تحسين أداء النقر على الروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // كود خاص بـ project3
    const imageViewer = document.getElementById('imageViewer');
    const expandedImage = document.getElementById('expandedImage');
    let currentGallery = [];
    let currentIndex = 0;
    let imageCache = new Map();

    // متغيرات عالمية للتحكم باللمس والحركة
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let isChangingImage = false;

    // تحسين الأداء باستخدام throttle
    const throttledChangeImage = throttle(300, (direction) => {
        if (!isChangingImage) {
            changeImage(direction);
        }
    });

    // تحميل الصور بشكل مسبق مع التخزين المؤقت
    async function preloadImage(src) {
        if (imageCache.has(src)) {
            return imageCache.get(src);
        }

        try {
            const img = new Image();
            const promise = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
            imageCache.set(src, promise);
            return promise;
        } catch (error) {
            console.error('خطأ في تحميل الصورة:', error);
            throw error;
        }
    }

    // تحميل الصور المجاورة
    async function preloadAdjacentImages(index) {
        const preloadPromises = [];
        const range = [-2, -1, 1, 2]; // تحميل صورتين قبل وبعد الصورة الحالية

        for (const offset of range) {
            const adjacentIndex = index + offset;
            if (adjacentIndex >= 0 && adjacentIndex < currentGallery.length) {
                preloadPromises.push(preloadImage(currentGallery[adjacentIndex]));
            }
        }

        try {
            await Promise.all(preloadPromises);
        } catch (error) {
            console.error('خطأ في تحميل الصور المجاورة:', error);
        }
    }

    // فتح عارض الصور
    window.openImageViewer = async function(imgElement) {
        const gallery = document.querySelector('.xo-gallery');
        const images = Array.from(gallery.querySelectorAll('.gallery-image'));
        currentGallery = images.map(img => img.dataset.src || img.src);
        currentIndex = images.indexOf(imgElement);

        imageViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
        
        // تحميل الصورة مع تأثير الظهور
        expandedImage.src = currentGallery[currentIndex];
        
        requestAnimationFrame(() => {
            imageViewer.classList.add('active');
            setTimeout(() => {
                expandedImage.classList.add('active');
                
                // إظهار أزرار التنقل
                document.querySelectorAll('.nav-btn').forEach(btn => {
                    btn.style.transition = 'all 0.3s ease-in-out 0.2s';
                });
            }, 100);
        });

        // تحميل الصور المجاورة
        preloadAdjacentImages(currentIndex);
    }

    // تغيير الصورة
    window.changeImage = async function(direction) {
        if (isChangingImage) return;
        isChangingImage = true;

        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= currentGallery.length) {
            isChangingImage = false;
            return;
        }

        // إخفاء الصورة الحالية
        expandedImage.classList.remove('active');
        
        setTimeout(async () => {
            // تحميل الصورة التالية
            expandedImage.src = currentGallery[nextIndex];
            currentIndex = nextIndex;
            
            // إظهار الصورة الجديدة
            setTimeout(() => {
                expandedImage.classList.add('active');
                isChangingImage = false;
                
                // تحميل الصور المجاورة
                preloadAdjacentImages(currentIndex);
            }, 100);
        }, 300);
    }

    // إغلاق عارض الصور
    window.closeImage = function() {
        expandedImage.classList.remove('active');
        imageViewer.classList.remove('active');
        
        setTimeout(() => {
            imageViewer.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // المتغيرات العامة لعارض الصور
    let currentImageIndex = 0;
    let galleryImages = [];

    // تحسين عرض الصور في المعرض
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('.gallery-image');
        
        images.forEach((img, index) => {
            // إضافة تأثير الظهور التدريجي
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease-in-out';
            
            // التحقق من اكتمال تحميل الصورة
            if (img.complete) {
                setTimeout(() => {
                    img.style.opacity = '1';
                }, index * 100);
            } else {
                img.onload = function() {
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, index * 100);
                };
            }
            
            // معالجة الأخطاء
            img.onerror = function() {
                this.src = 'placeholder.jpg';
                console.error('خطأ في تحميل الصورة:', this.src);
            };
        });
    });

    // إضافة استجابة للوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('imageViewer').style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeImage();
                    break;
                case 'ArrowLeft':
                    changeImage(-1);
                    break;
                case 'ArrowRight':
                    changeImage(1);
                    break;
            }
        }
    });

    // تحميل الصور بشكل كسول عند التمرير
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('.gallery-image[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        preloadImage(img.dataset.src)
                            .then(() => {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                            })
                            .catch(error => console.error('خطأ في تحميل الصورة:', error));
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    });

    // تحميل الصور بشكل كسول وإضافة تأثير الظهور التدريجي
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('.gallery-image');
        let delay = 200; // زيادة التأخير الأولي
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // تحميل الصورة إذا كانت تستخدم data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        
                        // انتظار تحميل الصورة قبل إظهارها
                        img.onload = () => {
                            setTimeout(() => {
                                requestAnimationFrame(() => {
                                    img.classList.add('fade-in');
                                });
                            }, delay);
                            delay += 200;
                        };
                    } else {
                        // إذا كانت الصورة محملة مسبقاً
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                img.classList.add('fade-in');
                            });
                        }, delay);
                        delay += 200;
                    }
                    
                    // إعادة تعيين التأخير بعد مجموعة من الصور
                    if (delay > 2000) {
                        delay = 200;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // بدء مراقبة الصور
        lazyImages.forEach(img => {
            img.classList.remove('fade-in');
            imageObserver.observe(img);
        });
    });
    
    // تحسين معالجة التمرير
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            const images = document.querySelectorAll('.gallery-image:not(.fade-in)');
            let delay = 200;
            
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top >= -50 && rect.bottom <= window.innerHeight + 50) {
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            img.classList.add('fade-in');
                        });
                    }, delay);
                    delay += 200;
                }
            });
        });
    }, { passive: true });
});

// تحسين أداء التمرير
function scrollHandler() {
    const scrolled = window.scrollY;
    if (Math.abs(lastScrollPosition - scrolled) > 50) {
        lastScrollPosition = scrolled;
        // تحديث العناصر المرئية فقط
        document.querySelectorAll('.aos-animate').forEach(element => {
            if (!isElementInViewport(element)) {
                element.classList.remove('aos-animate');
            }
        });
        
        document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('aos-animate');
            }
        });
    }
}

// تحسين تحميل الصور
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// تحميل الصور المجاورة
function preloadAdjacentImages(currentIndex) {
    const images = Array.from(document.querySelectorAll('.gallery-item img'));
    const totalImages = images.length;
    
    // تحميل الصورة التالية
    if (currentIndex < totalImages - 1) {
        preloadImage(images[currentIndex + 1].src);
    }
    // تحميل الصورة السابقة
    if (currentIndex > 0) {
        preloadImage(images[currentIndex - 1].src);
    }
}

// تحسين عارض الصور
function openPreview(src) {
    const viewer = document.getElementById('imageViewer') || createImageViewer();
    const image = document.getElementById('expandedImage');
    
    if (image) {
        // إظهار حالة التحميل
        image.style.opacity = '0.5';
        
        // تحميل الصورة
        preloadImage(src).then(() => {
            image.src = src;
            image.style.opacity = '1';
            viewer.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // تحميل الصور المجاورة
            const images = Array.from(document.querySelectorAll('.gallery-item img'));
            const currentIndex = images.findIndex(img => img.src === src);
            preloadAdjacentImages(currentIndex);
        });
    }
}

// إنشاء عارض الصور إذا لم يكن موجوداً
function createImageViewer() {
    const viewer = document.createElement('div');
    viewer.id = 'imageViewer';
    viewer.className = 'image-viewer';
    viewer.onclick = closePreview;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = e => {
        e.stopPropagation();
        closePreview();
    };
    
    const image = document.createElement('img');
    image.id = 'expandedImage';
    image.className = 'expanded-image';
    image.onclick = e => e.stopPropagation();
    
    viewer.appendChild(closeBtn);
    viewer.appendChild(image);
    document.body.appendChild(viewer);
    
    return viewer;
}

function closePreview() {
    const viewer = document.getElementById('imageViewer');
    if (viewer) {
        viewer.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// إضافة مستمع لمفتاح ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closePreview();
    }
});

// تهيئة lazy loading للصور
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// تحسين أداء الصور وتجنب مشاكل CORS
document.addEventListener('DOMContentLoaded', function() {
    // إضافة معالجة الأخطاء للصور
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.onerror = null;
            console.warn('فشل تحميل الصورة:', this.src);
        };
    });

    // تعطيل التتبع لتجنب مشاكل CORS
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
        link.rel = 'noopener noreferrer nofollow';
    });
});
