/* ============================================
   SMART LAB — Main JS
   ============================================ */
   document.addEventListener('DOMContentLoaded', () => {
  
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    // Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => revealObserver.observe(el));
  
    // Mobile Menu Toggle (Basic - we will expand later)
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        // We will implement the full mobile menu in the next phase
        alert('قائمة الموبايل رح نطورها بالمرحلة الجاية!');
      });
    }
      /* ============================================
     PATIENT PORTAL LOGIC (Symptom Checker & Booking)
     ============================================ */
  const symptomSelect = document.getElementById('symptomSelect');
  const suggestionResult = document.getElementById('suggestionResult');
  const testTypeInput = document.getElementById('testType');

  if (symptomSelect) {
    // 1. المساعد الذكي
    symptomSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      let suggestion = '';
      
      if (val === 'fatigue') {
        suggestion = 'بناءً على التعب والإرهاق، نقترح: تحليل فيتامين د، فيتامين B12، ووظائف الغدة الدرقية.';
      } else if (val === 'hair_loss') {
        suggestion = 'بناءً على تساقط الشعر، نقترح: تحليل الحديد (Ferritin)، الزنك، وفيتامين د.';
      } else if (val === 'stomach') {
        suggestion = 'بناءً على ألم المعدة، نقترح: تحليل جرثومة المعدة (H. Pylori) وصورة دم كاملة (CBC).';
      } else if (val === 'bone') {
        suggestion = 'بناءً على ألم العظام، نقترح: تحليل الكالسيوم، فيتامين د، وعامل الروماتيزم (CRP).';
      }

      if (suggestion) {
        suggestionResult.style.display = 'block';
        suggestionResult.textContent = suggestion;
        // تعبئة حقل التحاليل تلقائياً
        testTypeInput.value = suggestion.replace('بناءً على ', '').split('نقترح: ')[1];
      } else {
        suggestionResult.style.display = 'none';
        testTypeInput.value = '';
      }
    });

    // 2. اختيار الباقات
    window.selectPackage = function(name, price) {
      document.querySelectorAll('.package-card').forEach(c => c.classList.remove('selected'));
      event.currentTarget.classList.add('selected');
      testTypeInput.value = name + ' - ' + price + '$';
    };

        // ميزة محاكاة الذكاء الاصطناعي لتحليل صورة الوصفة
        const prescriptionInput = document.getElementById('prescription');
        const aiLoader = document.getElementById('aiLoader');
        const fastingWarning = document.getElementById('fastingWarning');
    
        if (prescriptionInput) {
          prescriptionInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
              aiLoader.style.display = 'block';
              
              // محاكاة تحليل الذكاء الاصطناعي (تأخير ثانيتين)
              setTimeout(() => {
                aiLoader.style.display = 'none';
                
                // تعبئة التحاليل تلقائياً (كما لو أن الـ AI قرأها من الصورة)
                testTypeInput.value = 'سكر صائم (FBS), صورة دم كاملة (CBC), فيتامين د (Vitamin D)';
                
                // تفعيل تنبيه الصيام لأن السكر صائم
                fastingWarning.style.display = 'flex';
                
                alert('✅ تم تحليل الصورة بنجاح! تم استخراج 3 تحاليل وتحديد السعر التقديري: 25$.');
              }, 2000);
            }
          });
        }
    
        // تفعيل تنبيه الصيام لو المريض كتب تحاليل معينة يدوياً
        if (testTypeInput) {
          testTypeInput.addEventListener('input', function() {
            const val = this.value;
            if (val.includes('سكر') || val.includes('دهون') || val.includes('كوليسترول') || val.includes('صائم')) {
              fastingWarning.style.display = 'flex';
            } else {
              fastingWarning.style.display = 'none';
            }
          });
        }
    // 3. إرسال الفورم للواتساب
    const bookingForm = document.getElementById('bookingForm');
    const successMsg = document.getElementById('successMsg');

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName').value;
      const phone = document.getElementById('patientPhone').value;
      const age = document.getElementById('patientAge').value;
      const weight = document.getElementById('patientWeight').value;
      const gender = document.getElementById('patientGender').value;
      const test = testTypeInput.value;
      const location = document.querySelector('input[name="location"]:checked').value;
      
          const date = document.getElementById('patientDate').value;
          const time = document.getElementById('patientTime').value;
          
  
          if(!time) {
            alert('الرجاء اختيار وقت الموعد');
            return;
          }
    
          // صياغة التاريخ مع الوقت للواتساب
          const fullDateTime = `${date} الساعة ${time}`;

      if (!test) {
        alert('الرجاء اختيار التحاليل أو استخدام المساعد الذكي أولاً.');
        return;
      }

      // صياغة رسالة الواتساب للمخبر
      // صياغة رسالة الواتساب للمخبر
      const waText = encodeURIComponent(
        `مرحباً، أود حجز موعد في المخبر:\n` +
        `👤 الاسم: ${name} (${gender})\n` +
        `🎂 العمر: ${age} سنة | ⚖️ الوزن: ${weight} كغ\n` +
        `📞 الهاتف: ${phone}\n` +
        `🧪 التحاليل: ${test}\n` +
        `📍 المكان: ${location}\n` +
        `📅 الموعد: ${fullDateTime}\n`
      );
      // فتح الواتساب (حط رقم المخبر هنا)
      window.open(`https://wa.me/963900000000?text=${waText}`, '_blank');

      // إظهار رسالة النجاح
      successMsg.style.display = 'block';
      bookingForm.reset();
      
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    });
  }

    /* ============================================
     CANVAS BACKGROUND EFFECT
     ============================================ */
     const canvas = document.getElementById('canvas-bg');
     if (canvas) {
       const ctx = canvas.getContext('2d');
       let width, height;
       let particles = [];
       const spacing = 22; 
       const baseColor = 'rgba(0, 102, 204, 0.35)'; 
       const hoverColor = { r: 0, g: 180, b: 255 }; 
       let mouse = { x: -1000, y: -1000 };
   
       function resize() {
           width = canvas.width = window.innerWidth;
           height = canvas.height = window.innerHeight;
           initGrid();
       }
   
       function initGrid() {
           particles = [];
           for (let x = 0; x < width; x += spacing) {
               for (let y = 0; y < height; y += spacing) {
                   particles.push({
                       x: x, y: y, baseX: x, baseY: y,
                       size: Math.random() * 2 + 2, 
                       density: (Math.random() * 20) + 5
                   });
               }
           }
       }
   
       window.addEventListener('mousemove', (e) => {
           mouse.x = e.clientX;
           mouse.y = e.clientY;
       });
   
       window.addEventListener('mouseleave', () => {
           mouse.x = -1000;
           mouse.y = -1000;
       });
   
       function draw() {
           ctx.clearRect(0, 0, width, height);
           for (let i = 0; i < particles.length; i++) {
               let p = particles[i];
               let dx = mouse.x - p.x;
               let dy = mouse.y - p.y;
               let distance = Math.sqrt(dx * dx + dy * dy);
               let maxDistance = 125; // الرقم اللي اخترته إنت
   
               if (distance < maxDistance) {
                   let force = (maxDistance - distance) / maxDistance;
                   let directionX = dx / distance;
                   let directionY = dy / distance;
                   
                   p.x -= directionX * force * p.density * 2.5;
                   p.y -= directionY * force * p.density * 2.5;
                   
                   ctx.fillStyle = `rgba(${hoverColor.r}, ${hoverColor.g}, ${hoverColor.b}, ${force + 0.4})`;
                   
                   ctx.beginPath();
                   ctx.moveTo(p.x, p.y);
                   ctx.lineTo(mouse.x, mouse.y);
                   ctx.strokeStyle = `rgba(${hoverColor.r}, ${hoverColor.g}, ${hoverColor.b}, ${force * 0.3})`;
                   ctx.lineWidth = 1;
                   ctx.stroke();
               } else {
                   ctx.fillStyle = baseColor;
                   p.x -= (p.x - p.baseX) * 0.1;
                   p.y -= (p.y - p.baseY) * 0.1;
               }
               ctx.beginPath();
               ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
               ctx.fill();
           }
           requestAnimationFrame(draw);
       }
       window.addEventListener('resize', resize);
       resize();
       draw();
     }
    /* ============================================
     RESULT TRACKING LOGIC (Updated to read from Staff)
     ============================================ */
     const trackBtn = document.getElementById('trackBtn');
     if (trackBtn) {
       trackBtn.addEventListener('click', () => {
         const input = document.getElementById('trackingInput').value.trim();
         const resultArea = document.getElementById('resultArea');
         const downloadArea = document.getElementById('downloadArea');
         
         // جلب بيانات المريض من الذاكرة (اللي دخلها الموظف من staff.html)
         const savedData = localStorage.getItem('lab-patient-' + input);
         
         if (savedData) {
           const data = JSON.parse(savedData);
           resultArea.style.display = 'block';
           downloadArea.style.display = 'none';
   
           // 1. إعادة تعيين الشكل الأولي للخطوات (عشان لو المستخدم عمل استعلام أكثر من مرة)
           document.getElementById('step1').className = 'status-step completed';
           document.getElementById('step2').className = 'status-step';
           document.getElementById('step3').className = 'status-step';
           document.getElementById('line1').className = 'status-line completed';
           document.getElementById('line2').className = 'status-line';
   
           // 2. تحديث الشكل بناءً على الحالة (1, 2, 3)
           if (data.status === '1') {
              // تم استلام العينة فقط
              document.getElementById('line1').className = 'status-line';
           } 
           else if (data.status === '2') {
              // قيد التحليل
              document.getElementById('step2').classList.add('active');
              document.getElementById('line1').classList.add('completed');
           } 
           else if (data.status === '3') {
              // النتيجة جاهزة
              document.getElementById('step2').className = 'status-step completed';
              document.getElementById('step3').className = 'status-step completed';
              document.getElementById('line2').classList.add('completed');
              document.getElementById('step3').querySelector('.step-icon').textContent = '✓';
              
              // ربط زر التحميل بصفحة التقرير وتمرير رقم المريض
              const downloadBtn = document.getElementById('downloadReportBtn');
              if (downloadBtn) {
                  downloadBtn.href = `report.html?id=${input}`;
              }
              
              // إظهار زر التحميل
              downloadArea.style.display = 'block';
           }
         } else {
           alert('لم يتم العثور على حجز بهذا الرقم. (للديمو، روح لصفحة staff.html واعمل إضافة للرقم 123)');
         }
       });
     }
    /* ============================================
     PWA SERVICE WORKER (SMART LAB)
     ============================================ */
     if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').catch(err => console.log('SW failed', err));
      });
    }
      /* ============================================
     PATIENT PAGE — FLOWING SILK EFFECT & AUTO DATE
     ============================================ */
  
  // 1. التأثير الحركي (Flowing Silk)
  const patientCanvas = document.getElementById('patient-bg');
  if (patientCanvas) {
    const ctx = patientCanvas.getContext('2d');
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    function resizeCanvas() {
      width = patientCanvas.width = window.innerWidth;
      height = patientCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function drawSilk() {
      ctx.clearRect(0, 0, width, height);
      time += 0.005; // سرعة الحركة

      // رسم 3 شرائط (Silk Ribbons)
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        
        // لون أزرق/سماوي شفاف
        ctx.strokeStyle = `rgba(0, 150, 255, ${0.1 + i * 0.05})`;
        ctx.lineWidth = 60 + i * 20; // عرض الشريط
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // حساب تأثير الماوس (إذا كان قريب)
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;
        if (mouse.x > 0) {
          mouseInfluenceX = (mouse.x - width / 2) * 0.1;
          mouseInfluenceY = (mouse.y - height / 2) * 0.1;
        }

        // رسم الشريط بموجات رياضية (Sine Waves)
        for (let x = -100; x <= width + 100; x += 20) {
          // معادلة الموجة
          let y = height / 2 + 
                  Math.sin(x * 0.002 + time + i) * 150 + // الموجة الأساسية
                  Math.cos(x * 0.001 - time) * 50 +      // موجة تانية
                  (x / width) * mouseInfluenceY +        // تأثير الماوس عمودي
                  Math.sin(time) * 50;                   // حركة عامة

          // تأثير الماوس على انحناء الشريط
          let distToMouse = Math.abs(x - mouse.x);
          if (distToMouse < 300) {
             y += (mouseInfluenceY * 0.5) * ((300 - distToMouse) / 300);
          }

          if (x === -100) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      requestAnimationFrame(drawSilk);
    }
    drawSilk();
  }

  // 2. التاريخ والوقت التلقائي (عجلة 3D)
  const patientDateInput = document.getElementById('patientDate');
  const timeSlotsContainer = document.getElementById('timeSlotsContainer');
  const hiddenTimeInput = document.getElementById('patientTime');

  if (patientDateInput && timeSlotsContainer && hiddenTimeInput) {
    // أ. تعبئة تاريخ اليوم تلقائياً
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    patientDateInput.value = `${year}-${month}-${day}`;

    // ب. توليد أوقات العيادة (من 9 صباحاً لـ 9 مساءً كل نص ساعة)
    const times = [];
    for (let h = 9; h <= 21; h++) {
      times.push(`${String(h).padStart(2, '0')}:00`);
      if (h !== 21) times.push(`${String(h).padStart(2, '0')}:30`);
    }

    // ج. طباعة الأوقات بالـ HTML
    times.forEach((time, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.textContent = time;
      slide.dataset.time = time;
      timeSlotsContainer.appendChild(slide);
    });

    // د. تشغيل مكتبة Swiper (العجلة)
    const timeSwiper = new Swiper('.timeSwiper', {
      direction: 'vertical',
      slidesPerView: 3, 
      centeredSlides: true,
      spaceBetween: 10,
      mousewheel: true, 
      freeMode: false,
      snapToGrid: true, 
      on: {
        init: function () {
          const activeTime = times[this.activeIndex];
          hiddenTimeInput.value = activeTime;
        },
        slideChange: function () {
          const activeSlide = document.querySelector('.swiper-slide-active');
          if (activeSlide) {
            hiddenTimeInput.value = activeSlide.dataset.time;
          }
        }
      }
    });
  }


    /* ============================================
     STAFF DASHBOARD LOGIC
     ============================================ */
     const staffForm = document.getElementById('staffForm');
     if (staffForm) {
       staffForm.addEventListener('submit', (e) => {
         e.preventDefault();
         
         const patientId = document.getElementById('staffPatientId').value.trim();
         const patientName = document.getElementById('staffPatientName').value.trim();
         const status = document.getElementById('staffStatus').value;
   
         // تخزين بيانات المريض في المتصفح
         const patientData = {
           id: patientId,
           name: patientName,
           status: status,
           date: new Date().toLocaleDateString('en-GB')
         };
   
         localStorage.setItem('lab-patient-' + patientId, JSON.stringify(patientData));
   
         // إظهار رسالة النجاح
         const successMsg = document.getElementById('staffSuccess');
         successMsg.style.display = 'block';
         setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
       });
     }
  });
