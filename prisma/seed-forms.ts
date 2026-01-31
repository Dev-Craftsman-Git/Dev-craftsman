
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding form fields...');

    // Student Form Fields
    const studentFields = [
        { label: 'Full Name', name: 'name', type: 'text', required: true, width: 'half', order: 1 },
        { label: 'Email Address', name: 'email', type: 'email', required: true, width: 'half', order: 2 },
        { label: 'Phone Number', name: 'phone', type: 'tel', required: true, width: 'half', order: 3 },
        { label: 'College/University', name: 'college', type: 'text', required: true, width: 'half', order: 4 },
        { label: 'Project Type', name: 'projectType', type: 'select', options: JSON.stringify(['Final Year Project', 'Mini Project', 'Learning Module', 'Other']), required: true, width: 'full', order: 5 },
        { label: 'Project Title/Idea', name: 'title', type: 'text', required: true, width: 'full', order: 6 },
        { label: 'Description', name: 'description', type: 'textarea', required: true, width: 'full', order: 7 },
        { label: 'Deadline', name: 'deadline', type: 'date', required: false, width: 'half', order: 8 },
        { label: 'Budget (INR)', name: 'budget', type: 'text', required: false, width: 'half', order: 9 },
    ];

    for (const field of studentFields) {
        await prisma.formField.upsert({
            where: { id: `student-${field.name}` }, // Helper ID
            update: {},
            create: {
                id: `student-${field.name}`,
                formType: 'student',
                ...field
            }
        });
    }

    // Commercial Form Fields
    const commercialFields = [
        { label: 'Contact Name', name: 'name', type: 'text', required: true, width: 'half', order: 1 },
        { label: 'Business Email', name: 'email', type: 'email', required: true, width: 'half', order: 2 },
        { label: 'Company Name', name: 'company', type: 'text', required: true, width: 'half', order: 3 },
        { label: 'Phone Number', name: 'phone', type: 'tel', required: true, width: 'half', order: 4 },
        { label: 'Service Required', name: 'service', type: 'select', options: JSON.stringify(['Web Development', 'Mobile App', 'Enterprise Software', 'Consulting', 'Other']), required: true, width: 'full', order: 5 },
        { label: 'Project Overview', name: 'overview', type: 'textarea', required: true, width: 'full', order: 6 },
        { label: 'Estimated Timeline', name: 'timeline', type: 'text', required: false, width: 'half', order: 7 },
        { label: 'Budget Range', name: 'budget', type: 'select', options: JSON.stringify(['< ₹50k', '₹50k - ₹2L', '₹2L - ₹10L', '> ₹10L']), required: false, width: 'half', order: 8 },
    ];

    for (const field of commercialFields) {
        await prisma.formField.upsert({
            where: { id: `commercial-${field.name}` },
            update: {},
            create: {
                id: `commercial-${field.name}`,
                formType: 'commercial',
                ...field
            }
        });
    }

    console.log('Form fields seeded successfully.');
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
