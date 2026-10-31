/* ============================================
   Micro Stats Grid Effect (Medical Theme)
   ============================================ */
   const canvas = document.getElementById('canvas-bg');
   const ctx = canvas.getContext('2d');
   
   let width, height;
   let particles = [];
   const spacing = 40; // المسافة بين كل نقطة والتانية (كل ما تقل، الشبكة تصير أكثف)
   
   // إعدادات الألوان الطبية
   const baseColor = { r: 0, g: 102, b: 204 }; // أزرق طبي
   const waveColor = { r: 0, g: 180, b: 255 }; // سماوي فاتح
   
   let mouse = { x: -1000, y: -1000 };
   
   // إعادة ضبط حجم الكانفاس لما الشاشة تتغير
   function resize() {
       width = canvas.width = window.innerWidth;
       height = canvas.height = window.innerHeight;
       initGrid();
   }
   
   // إنشاء شبكة النقاط
   function initGrid() {
       particles = [];
       for (let x = 0; x < width; x += spacing) {
           for (let y = 0; y < height; y += spacing) {
               particles.push({
                   x: x,
                   y: y,
                   baseX: x,
                   baseY: y,
                   size: Math.random() * 2 + 1, // حجم النقطة
                   density: (Math.random() * 30) + 1
               });
           }
       }
   }
   
   // حركة الماوس
   window.addEventListener('mousemove', (e) => {
       mouse.x = e.clientX;
       mouse.y = e.clientY;
   });
   
   // دالة الرسم الأساسية
   function draw() {
       ctx.clearRect(0, 0, width, height);
   
       // رسم خطوط خفيفة بين النقاط عشان تعطي شكل "شبكة"
       ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.05)`;
       ctx.lineWidth = 1;
   
       for (let i = 0; i < particles.length; i++) {
           let p = particles[i];
   
           // حساب المسافة بين الماوس والنقطة
           let dx = mouse.x - p.x;
           let dy = mouse.y - p.y;
           let distance = Math.sqrt(dx * dx + dy * dy);
           let maxDistance = 200; // مدى تأثير الماوس
   
           // إذا النقطة قريبة من الماوس، نحركها شوي
           if (distance < maxDistance) {
               let force = (maxDistance - distance) / maxDistance;
               let directionX = dx / distance;
               let directionY = dy / distance;
               
               // حركة الموجة
               p.x -= directionX * force * p.density * 2;
               p.y -= directionY * force * p.density * 2;
               
               // تغيير اللون للنقاط القريبة
               let colorIntensity = force;
               let r = Math.floor(baseColor.r + (waveColor.r - baseColor.r) * colorIntensity);
               let g = Math.floor(baseColor.g + (waveColor.g - baseColor.g) * colorIntensity);
               let b = Math.floor(baseColor.b + (waveColor.b - baseColor.b) * colorIntensity);
               
               ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + force})`;
           } else {
               ctx.fillStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.1)`;
               
               // رجوع النقطة لمكانها الأصلي ببطء
               p.x -= (p.x - p.baseX) * 0.05;
               p.y -= (p.y - p.baseY) * 0.05;
           }
   
           // رسم النقطة
           ctx.beginPath();
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
           ctx.fill();
       }
   
       requestAnimationFrame(draw);
   }
   
   // تشغيل كل شي
   window.addEventListener('resize', resize);
   resize();
   draw();