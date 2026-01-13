import { useEffect, useRef } from "react";

export function NeuralSphere() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        // Sphere Config
        const GLOBE_RADIUS = width < 500 ? 100 : 180;
        const DOT_RADIUS = 2;
        const GLOBE_CENTER_Z = -GLOBE_RADIUS;
        const PROJECTION_CENTER_X = width / 2;
        const PROJECTION_CENTER_Y = height / 2;
        const FIELD_OF_VIEW = width * 0.8;

        let dots: Dot[] = [];
        let rotation = 0;
        let tilt = 0;

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationSpeed = 0.002;
        let currentRotationSpeed = 0.002;

        class Dot {
            theta: number;
            phi: number;
            x: number;
            y: number;
            z: number;
            xProjected: number;
            yProjected: number;
            scaleProjected: number;

            constructor(theta: number, phi: number) {
                this.theta = theta;
                this.phi = phi;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.xProjected = 0;
                this.yProjected = 0;
                this.scaleProjected = 0;
            }

            project() {
                // Rotation logic
                const rotX = rotation;
                const rotY = tilt;

                // Spherical to Cartesian
                this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
                this.y = GLOBE_RADIUS * Math.cos(this.phi);
                this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_CENTER_Z;

                // Rotate around Y axis (Auto rotation + Mouse X influence)
                const x1 = this.x * Math.cos(rotX) - this.z * Math.sin(rotX);
                const z1 = this.z * Math.cos(rotX) + this.x * Math.sin(rotX);

                // Rotate around X axis (Mouse Y influence)
                const y1 = this.y * Math.cos(rotY) - z1 * Math.sin(rotY);
                const z2 = z1 * Math.cos(rotY) + this.y * Math.sin(rotY);

                this.scaleProjected = FIELD_OF_VIEW / (FIELD_OF_VIEW + z2);
                this.xProjected = (x1 * this.scaleProjected) + PROJECTION_CENTER_X;
                this.yProjected = (y1 * this.scaleProjected) + PROJECTION_CENTER_Y;
            }

            draw() {
                const alpha = (this.scaleProjected - 0.5) * 2; // Fade back dots
                if (alpha <= 0) return;

                ctx!.beginPath();
                // Dynamic color based on position
                const isCyan = Math.random() > 0.8;
                ctx!.fillStyle = `rgba(${isCyan ? '0, 217, 255' : '139, 92, 246'}, ${alpha})`;
                ctx!.arc(this.xProjected, this.yProjected, DOT_RADIUS * this.scaleProjected, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        // Initialize Dots (Fibonacci Sphere)
        const initDots = () => {
            dots = [];
            const samples = 600;
            const phi = Math.PI * (3 - Math.sqrt(5));

            for (let i = 0; i < samples; i++) {
                const y = 1 - (i / (samples - 1)) * 2;
                const radius = Math.sqrt(1 - y * y);
                const theta = phi * i;
                dots.push(new Dot(theta, Math.acos(y)));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update Physics
            currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.1;
            rotation += currentRotationSpeed;

            // Mouse Tilt
            const targetTilt = (mouseY - height / 2) * 0.001;
            tilt += (targetTilt - tilt) * 0.1;

            // Mouse Speed Impact
            const distFromCenter = Math.abs(mouseX - width / 2);
            targetRotationSpeed = 0.002 + (distFromCenter * 0.00005);

            dots.forEach(dot => {
                dot.project();
                dot.draw();
            });

            // Connections (Neural Lines - simplified for performance)
            ctx.strokeStyle = "rgba(0, 217, 255, 0.15)";
            ctx.lineWidth = 0.5;
            for (let i = 0; i < dots.length; i += 8) { // Skip some to reduce load
                const d = dots[i];
                if ((d.scaleProjected - 0.5) * 2 <= 0) continue;

                // Connect to nearest neighbor in array (approximate)
                const neighbor = dots[(i + 5) % dots.length];
                ctx.beginPath();
                ctx.moveTo(d.xProjected, d.yProjected);
                ctx.lineTo(neighbor.xProjected, neighbor.yProjected);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            initDots();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        initDots();
        const animationId = requestAnimationFrame(animate);
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}
