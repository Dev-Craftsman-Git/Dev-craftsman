
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@devcraftsman.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
        },
    });

    console.log({ admin });

    // Seed Projects
    const projects = [
        {
            title: 'E-Commerce Platform',
            slug: 'ecommerce-platform',
            description: 'A full-featured e-commerce solution with inventory management, payment gateway integration, and customer analytics.',
            content: '# E-Commerce Platform\n\nBuilt with Next.js and Stripe, this platform offers seamless shopping experiences. The architecture is designed for high scalability and performance.',
            client: 'StyleHub Retail Inc.',
            industry: 'Retail',
            tags: JSON.stringify(['Next.js', 'Stripe', 'Tailwind', 'PostgreSQL']),
            thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80',
                'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80'
            ]),
            challenges: '### Scaling for Black Friday\nOne of the main challenges was ensuring the system could handle sudden spikes in traffic during sales events. We also needed to synchronize inventory across multiple warehouses in real-time.',
            solutions: '### Microservices & Caching\nWe implemented a microservices architecture using Docker and Kubernetes to scale individual components. Redis was used for caching frequently accessed product data, reducing database load by 60%.',
            websiteUrl: 'https://example.com/ecommerce',
            repoUrl: 'https://github.com/example/ecommerce',
            status: 'PUBLISHED',
            isFeatured: true,
        },
        {
            title: 'AI Chat Application',
            slug: 'ai-chat-app',
            description: 'Intelligent customer support bot powered by LLMs, featuring real-time sentiment analysis and automated ticket routing.',
            content: '# AI Chat App\n\nLeveraging OpenAI API for human-like conversations. This tool drastically reduces the workload on human support agents.',
            client: 'TechFlow Solutions',
            industry: 'Technology',
            tags: JSON.stringify(['React', 'OpenAI', 'Node.js', 'Socket.io']),
            thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'
            ]),
            challenges: '### Latency & Context\nMaintaining context over long conversations and minimizing latency from the AI provider were significant hurdles.',
            solutions: '### Vector Database & Edge Functions\nWe utilized a vector database (Pinecone) for long-term memory retrieval and deployed edge functions to stream responses, improving perceived latency.',
            websiteUrl: 'https://example.com/aichat',
            repoUrl: 'https://github.com/example/aichat',
            status: 'PUBLISHED',
            isFeatured: true,
        },
        {
            title: 'Corporate Dashboard',
            slug: 'corporate-dashboard',
            description: 'Interactive analytics dashboard for enterprise data visualization and reporting.',
            content: '# Corporate Dashboard\n\nData visualization at its finest. Provides real-time insights into company performance metrics.',
            client: 'Global Finance Corp',
            industry: 'Finance',
            tags: JSON.stringify(['Vue.js', 'D3.js', 'Firebase']),
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
                'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=800&q=80'
            ]),
            challenges: '### Complex Data Sets\nRendering millions of data points on the frontend without lagging the browser was the primary challenge.',
            solutions: '### Data Aggregation & Virtualization\nWe implemented server-side aggregation pipelines to pre-process data and used windowing/virtualization techniques on the frontend to render only visible data points.',
            websiteUrl: 'https://example.com/dashboard',
            repoUrl: 'https://github.com/example/board',
            status: 'PUBLISHED',
            isFeatured: true,
        }
    ];

    for (const project of projects) {
        await prisma.project.upsert({
            where: { slug: project.slug },
            update: {},
            create: project,
        });
    }
    console.log('Projects seeded');

    // Seed Pricing Plans
    const plans = [
        {
            type: 'STUDENT',
            name: 'Basic',
            price: 499,
            originalPrice: 999,
            currency: 'INR',
            features: [
                'Basic Project Assistance',
                'Code Review',
                'Email Support'
            ]
        },
        {
            type: 'STUDENT',
            name: 'Pro',
            price: 999,
            originalPrice: 1999,
            currency: 'INR',
            isPopular: true,
            features: [
                'Complete Project Development',
                'Priority Support',
                'Live Explanation Session',
                'Documentation Included'
            ]
        },
        {
            type: 'COMMERCIAL',
            name: 'Enterprise',
            price: 29999,
            currency: 'INR',
            features: [
                'Custom Software Development',
                'Dedicated Project Manager',
                '24/7 Support',
                'Cloud Deployment',
                'Maintenance Included'
            ]
        }
    ];

    for (const plan of plans) {
        // We can't upsert easily without a unique key other than ID, but we can check existence by name/type or just create.
        // For simplicity in this seed, let's look up by name first.
        const existing = await prisma.pricingPlan.findFirst({
            where: { name: plan.name, type: plan.type }
        });

        if (!existing) {
            await prisma.pricingPlan.create({
                data: {
                    type: plan.type,
                    name: plan.name,
                    price: plan.price,
                    originalPrice: plan.originalPrice,
                    currency: plan.currency,
                    isPopular: plan.isPopular || false,
                    features: {
                        create: plan.features.map(text => ({ text }))
                    }
                }
            });
        }
    }
    console.log('Pricing plans seeded');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
