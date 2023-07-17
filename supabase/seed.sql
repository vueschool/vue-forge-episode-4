-- Insert seed data for 'users' table with avatar URLs
INSERT INTO
  users (
    uuid,
    firstName,
    lastName,
    username,
    bio,
    email,
    avatar
  )
VALUES
  (
    'e6586752-42f5-49c8-9a40-9b3c8651c5cf',
    'John',
    'Doe',
    'johndoe',
    'Hi, I am John Doe.',
    'john.doe@example.com',
    'https://i.pravatar.cc/150?u=e6586752-42f5-49c8-9a40-9b3c8651c5cf'
  ),
  (
    'c826d894-9216-4e6e-97ad-8ab9d0d3a283',
    'Jane',
    'Smith',
    'janesmith',
    'Hello, I am Jane Smith.',
    'jane.smith@example.com',
    'https://i.pravatar.cc/150?u=c826d894-9216-4e6e-97ad-8ab9d0d3a283'
  ),
  (
    '836fa23d-7c0e-4fbf-8ed1-0e48b19e99ca',
    'Mike',
    'Johnson',
    'mikejohnson',
    'Hey, I am Mike Johnson.',
    'mike.johnson@example.com',
    'https://i.pravatar.cc/150?u=836fa23d-7c0e-4fbf-8ed1-0e48b19e99ca'
  );
INSERT INTO
  categories (uuid, name, slug)
VALUES
  (
    '45f42df8-3e1d-4b2d-8f80-7c35806d5739',
    'Technology',
    'technology'
  ),
  (
    'ac52d4f3-20bf-4956-8305-6b9870bb8593',
    'Art',
    'art'
  ),
  (
    'ea22c5ed-3cf6-4ff1-9e32-9f2f39f32c94',
    'Music',
    'music'
  ),
  (
    '0d09f204-921e-4e96-bc78-4e3b9357f6a7',
    'Fashion',
    'fashion'
  ),
  (
    'e95a8fdd-3e14-48b6-a4f6-6f6625a4576c',
    'Food',
    'food'
  ),
  (
    'c5c0d889-0676-4411-92e3-b8c30c43260e',
    'Film & Video',
    'film_video'
  ),
  (
    '788f13ac-45aa-44b7-98f1-48c669b1a27a',
    'Books',
    'books'
  ),
  (
    '3a8ef95f-3c99-4192-8197-7cb289d23933',
    'Design',
    'design'
  );-- Insert seed data for 'projects' table
INSERT INTO
  projects (
    uuid,
    title,
    excerpt,
    description,
    image,
    category_uuid,
    pledged,
    backers,
    funded,
    softCap,
    hardCap,
    finishesAt,
    createdAt,
    lastUpdatedAt
  )
VALUES
  (
    '2e1cdbe1-0513-4f6c-9aa3-85e8c81aef05',
    'Smartwatch Project',
    'Revolutionary smartwatch',
    'This smartwatch project aims to bring the latest technology to your wrist.',
    'https://loremflickr.com/320/240/smartwatch',
    '45f42df8-3e1d-4b2d-8f80-7c35806d5739',
    25000.00,
    120,
    'funded',
    '20000.00',
    '50000.00',
    '2023-08-31 23:59:59',
    '2023-07-15 10:30:00',
    '2023-07-15 10:30:00'
  ),
  (
    '69857ae3-781e-4e8f-bd82-dcdef158e0dd',
    'Art Exhibition',
    'Contemporary art exhibition',
    'An art exhibition showcasing the works of talented artists.',
    'https://loremflickr.com/320/240/art_exhibition',
    'ac52d4f3-20bf-4956-8305-6b9870bb8593',
    5000.00,
    50,
    'funded',
    '4000.00',
    '8000.00',
    '2023-09-15 23:59:59',
    '2023-07-16 09:45:00',
    '2023-07-16 09:45:00'
  ),
  (
    'a68d6b5b-6b26-4de0-aa58-5baf5117d362',
    'Album Recording',
    'Debut album recording',
    'Support the recording of our debut music album.',
    'https://loremflickr.com/320/240/album_recording',
    'ea22c5ed-3cf6-4ff1-9e32-9f2f39f32c94',
    8000.00,
    90,
    'funded',
    '6000.00',
    '10000.00',
    '2023-10-10 23:59:59',
    '2023-07-16 14:20:00',
    '2023-07-16 14:20:00'
  ),
  (
    '16c0a6cc-2855-45ac-90fb-2b2000cf27a3',
    'Fashion Clothing Line',
    'New fashion clothing line',
    'Launching a trendy clothing line with unique designs and styles.',
    'https://loremflickr.com/320/240/fashion_clothing',
    '0d09f204-921e-4e96-bc78-4e3b9357f6a7',
    15000.00,
    80,
    'funded',
    '12000.00',
    '25000.00',
    '2023-11-30 23:59:59',
    '2023-07-17 10:30:00',
    '2023-07-17 10:30:00'
  ),
  (
    '24bf1685-19cd-429c-8a98-370e51da0b05',
    'Organic Food Delivery',
    'Fresh organic food delivery service',
    'Starting a sustainable and healthy food delivery business.',
    'https://loremflickr.com/320/240/organic_food_delivery',
    'e95a8fdd-3e14-48b6-a4f6-6f6625a4576c',
    8000.00,
    60,
    'funded',
    '6000.00',
    '10000.00',
    '2023-10-20 23:59:59',
    '2023-07-17 11:45:00',
    '2023-07-17 11:45:00'
  ),
  (
    '5a777f6b-9c25-4b8d-8016-40dd0d4b8ab0',
    'Indie Short Film',
    'Short film production',
    'Creating an indie short film exploring a thought-provoking story.',
    'https://loremflickr.com/320/240/indie_short_film',
    'c5c0d889-0676-4411-92e3-b8c30c43260e',
    5000.00,
    40,
    'funded',
    '4000.00',
    '8000.00',
    '2023-09-25 23:59:59',
    '2023-07-17 14:20:00',
    '2023-07-17 14:20:00'
  ),
  (
    'a5b76928-90c5-4d97-b21a-8426414bb6a7',
    'Tech Gadget Innovation',
    'Innovative tech gadgets',
    'Developing cutting-edge tech gadgets for everyday use.',
    'https://loremflickr.com/320/240/tech_gadgets',
    '45f42df8-3e1d-4b2d-8f80-7c35806d5739',
    8000.00,
    70,
    'funded',
    '6000.00',
    '10000.00',
    '2023-09-18 23:59:59',
    '2023-07-20 09:45:00',
    '2023-07-20 09:45:00'
  ),
  (
    '3265dcd0-1c0d-4c2b-994a-06efce3af641',
    'Art Therapy Workshops',
    'Art therapy for mental health',
    'Organizing art therapy workshops to promote mental well-being.',
    'https://loremflickr.com/320/240/art_therapy',
    'ac52d4f3-20bf-4956-8305-6b9870bb8593',
    4000.00,
    40,
    'funded',
    '3000.00',
    '6000.00',
    '2023-10-05 23:59:59',
    '2023-07-21 11:00:00',
    '2023-07-21 11:00:00'
  ),
  (
    'f57028e0-e660-4d62-a913-7e8499e8c433',
    'Jazz Music Album',
    'Soulful jazz music album',
    'Recording an album featuring soulful jazz melodies and improvisations.',
    'https://loremflickr.com/320/240/jazz_music',
    'ea22c5ed-3cf6-4ff1-9e32-9f2f39f32c94',
    6000.00,
    80,
    'funded',
    '5000.00',
    '8000.00',
    '2023-11-05 23:59:59',
    '2023-07-22 14:30:00',
    '2023-07-22 14:30:00'
  );
