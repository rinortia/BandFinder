import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase('ru-RU');
}

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      name: 'Александр',
      email: 'alex@example.com',
      age: 21,
      city: 'Москва',
      instrument: 'Гитара',
      genres: 'Рок, Alternative Rock, Metal',
      experience: '5 лет',
      photo: 'https://images.unsplash.com/photo-1511379938546-c1f69419868d?w=400',
      description: 'Играю на ритм- и соло-гитаре. Ищу единомышленников для создания группы.',
      contact: '+7 961 672 08 52',
    },
    {
      name: 'Мария',
      email: 'maria@example.com',
      age: 24,
      city: 'Санкт-Петербург',
      instrument: 'Вокал',
      genres: 'Джаз, Soul',
      experience: '3 года',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Вокалистка с опытом выступлений на джазовых вечерах.',
      contact: '@maria_vocal',
    },
    {
      name: 'Дмитрий',
      email: 'dmitry@example.com',
      age: 28,
      city: 'Москва',
      instrument: 'Барабаны',
      genres: 'Рок, Punk',
      experience: '7 лет',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Барабанщик, играю в разных стилях. Открыт к новым проектам.',
      contact: '+7 900 123 45 67',
    },
    {
      name: 'Елена',
      email: 'elena@example.com',
      age: 22,
      city: 'Казань',
      instrument: 'Фортепиано',
      genres: 'Pop, Indie',
      experience: '4 года',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      description: 'Клавишница и аранжировщик. Люблю экспериментировать с звуком.',
      contact: 'elena.keys@mail.ru',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        profile: {
          update: {
            contact: u.contact,
          },
        },
      },
      create: {
        name: u.name,
        email: u.email,
        password,
        age: u.age,
        role: 'musician',
        profile: {
          create: {
            city: u.city,
            instrument: u.instrument,
            genres: u.genres,
            experience: u.experience,
            photo: u.photo,
            description: u.description,
            contact: u.contact,
            citySearch: normalizeSearchText(u.city),
            instrumentSearch: normalizeSearchText(u.instrument),
            genresSearch: normalizeSearchText(u.genres),
          },
        },
      },
    });
  }

  const alex = await prisma.user.findUnique({ where: { email: 'alex@example.com' } });
  const dmitry = await prisma.user.findUnique({ where: { email: 'dmitry@example.com' } });

  if (alex) {
    await prisma.ad.deleteMany({ where: { userId: alex.id } });
    await prisma.ad.createMany({
      data: [
        {
          userId: alex.id,
          type: 'LOOKING_FOR_BAND',
          icon: 'guitar',
          city: 'Москва',
          genre: 'Рок',
          citySearch: normalizeSearchText('Москва'),
          genreSearch: normalizeSearchText('Рок'),
          instrument: 'Гитара',
          about: 'Я гитарист. Играю 4 года. Ищу рок-группу в Москве.',
          contact: '+7 961 672 08 52',
          status: 'active',
        },
        {
          userId: alex.id,
          type: 'LOOKING_FOR_MUSICIAN',
          icon: 'drums',
          city: 'Москва',
          genre: 'Рок',
          citySearch: normalizeSearchText('Москва'),
          genreSearch: normalizeSearchText('Рок'),
          lookingFor: 'Барабанщик, Басист',
          description: 'Собираю рок-группу. Ищу барабанщика и басиста.',
          contact: '+7 961 672 08 52',
          status: 'active',
        },
      ],
    });
  }

  if (dmitry) {
    await prisma.ad.create({
      data: {
        userId: dmitry.id,
        type: 'LOOKING_FOR_MUSICIAN',
        icon: 'microphone',
        city: 'Москва',
        genre: 'Punk',
        citySearch: normalizeSearchText('Москва'),
        genreSearch: normalizeSearchText('Punk'),
        lookingFor: 'Вокалист',
        description: 'Ищу вокалиста для панк-группы.',
        contact: '+7 900 123 45 67',
        status: 'active',
      },
    });
  }

  const profiles = await prisma.musicianProfile.findMany();
  for (const profile of profiles) {
    await prisma.musicianProfile.update({
      where: { id: profile.id },
      data: {
        citySearch: normalizeSearchText(profile.city),
        instrumentSearch: normalizeSearchText(profile.instrument),
        genresSearch: normalizeSearchText(profile.genres),
      },
    });
  }

  const ads = await prisma.ad.findMany();
  for (const ad of ads) {
    await prisma.ad.update({
      where: { id: ad.id },
      data: {
        citySearch: normalizeSearchText(ad.city),
        genreSearch: normalizeSearchText(ad.genre),
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
