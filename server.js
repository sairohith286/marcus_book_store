import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'marcus-book-store-secret-change-this-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marcus_book_store';
app.use(cors());
app.use(express.json());
const SEED_BOOKS = [
    // PHILOSOPHY (3 Books)
    {
        id: 'phil-1',
        title: 'Meditations',
        author: 'Marcus Aurelius',
        category: 'philosophy',
        price: 28,
        description: 'Private spiritual reflections of the Roman Emperor Marcus Aurelius on Stoic duty, impermanence, inner sovereignty, and the art of living with profound dignity.',
        details: 'Written during campaigns on the Danubian frontier, Meditations remains one of the world\'s greatest works of spiritual and ethical reflection. Aurelius grapples with mortality, human friction, and cosmic fate, guiding himself toward tranquil fortitude.',
        quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
        pages: 254,
        publisher: 'Marcus Classics & Oxford Translation',
        year: 180,
        isbn: '978-0140449334',
        coverImage: '/images/cover_philosophy_meditations_1793943547251.jpg',
        accentColor: '#292524',
        rating: 4.9,
        reviewsCount: 342,
        stock: 24,
    },
    {
        id: 'phil-2',
        title: 'Beyond Good and Evil',
        author: 'Friedrich Nietzsche',
        category: 'philosophy',
        price: 26,
        description: 'A penetrating critique of traditional Western morality, unveiling the psychological nuances of dogma, the will to power, and the pursuit of intellectual autonomy.',
        details: 'In Beyond Good and Evil, Nietzsche confronts centuries of metaphysical assumptions. Through incisive aphorisms, he challenges rigid dichotomies of virtue and vice, inviting the reader into a radical philosophical landscape of free spirits.',
        quote: 'He who fights with monsters should look to it that he himself does not become a monster. And if you gaze long into an abyss, the abyss also gazes into you.',
        pages: 288,
        publisher: 'Marcus Philosophy Press',
        year: 1886,
        isbn: '978-0140449235',
        coverImage: '',
        accentColor: '#3F3F46',
        rating: 4.8,
        reviewsCount: 218,
        stock: 18,
    },
    {
        id: 'phil-3',
        title: 'The Myth of Sisyphus',
        author: 'Albert Camus',
        category: 'philosophy',
        price: 24,
        description: 'Camus\' foundational philosophical treatise on the absurd condition of human existence and the lucid, rebellious embrace of vitality and authentic freedom.',
        details: 'Faced with a universe silent to human longing for transcendent meaning, Camus posits the myth of Sisyphus as the ultimate allegory. Instead of despair, he posits defiance, passion, and lucidity: "One must imagine Sisyphus happy."',
        quote: 'In the midst of winter, I found there was, within me, an invincible summer.',
        pages: 212,
        publisher: 'Vintage International Editions',
        year: 1942,
        isbn: '978-0679733737',
        coverImage: '',
        accentColor: '#1C1917',
        rating: 4.8,
        reviewsCount: 194,
        stock: 15,
    },
    // SELF-HELP (3 Books)
    {
        id: 'self-1',
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'self-help',
        price: 30,
        description: 'A practical, science-backed framework for making tiny behavioral adjustments that yield extraordinary compounding improvements over time.',
        details: 'Clear synthesizes cognitive psychology, neuroscience, and biology to demystify how daily habits form, stick, and reshape identity. With practical rules on cue, craving, response, and reward, it serves as an indispensable modern blueprint.',
        quote: 'You do not rise to the level of your goals. You fall to the level of your systems.',
        pages: 320,
        publisher: 'Avery Publishing & Marcus Select',
        year: 2018,
        isbn: '978-0735211292',
        coverImage: '/images/cover_selfhelp_habits_1793943547765.jpg',
        accentColor: '#C2410C',
        rating: 4.9,
        reviewsCount: 680,
        stock: 45,
    },
    {
        id: 'self-2',
        title: 'The Courage to Be Disliked',
        author: 'Ichiro Kishimi & Fumitake Koga',
        category: 'self-help',
        price: 25,
        description: 'Alfred Adler\'s psychological wisdom delivered through a compelling Socratic dialogue on interpersonal freedom, self-acceptance, and living in the present.',
        details: 'Written as a conversation between a philosopher and an inquisitive youth in Kyoto, this work demonstrates how we possess the freedom to determine our own lives, disentangle from other people\'s expectations, and find genuine community.',
        quote: 'The courage to be happy also includes the courage to be disliked.',
        pages: 288,
        publisher: 'Atria Books / Simon & Schuster',
        year: 2013,
        isbn: '978-1501197277',
        coverImage: '',
        accentColor: '#0369A1',
        rating: 4.7,
        reviewsCount: 312,
        stock: 22,
    },
    {
        id: 'self-3',
        title: "Man's Search for Meaning",
        author: 'Viktor E. Frankl',
        category: 'self-help',
        price: 22,
        description: 'Psychiatrist Viktor Frankl\'s timeless memoir of survival in concentration camps and his development of logotherapy—discovering purpose in every circumstance.',
        details: 'A monumental testament to the resilience of the human spirit. Frankl outlines how the primary human drive is neither pleasure nor power, but the discovery of meaningful purpose, even amidst involuntary suffering.',
        quote: 'Those who have a \'why\' to live, can bear with almost any \'how\'.',
        pages: 192,
        publisher: 'Beacon Press Heritage',
        year: 1946,
        isbn: '978-0807014295',
        coverImage: '',
        accentColor: '#475569',
        rating: 4.9,
        reviewsCount: 520,
        stock: 30,
    },
    // POETRY (3 Books)
    {
        id: 'poet-1',
        title: 'Selected Poems & Verses',
        author: 'Rainer Maria Rilke',
        category: 'poetry',
        price: 32,
        description: 'Luminous, mystical verses exploring solitary introspection, transient beauty, and divine communion from Rilke\'s Duino Elegies and Sonnets to Orpheus.',
        details: 'A bilingual edition capturing Rilke\'s exquisite lyricism, translated with fidelity to the music of the original verse. These poems invite deep stillness, quiet awe, and an open heart toward the mysteries of existence.',
        quote: 'Let everything happen to you: beauty and terror. Just keep going. No feeling is final.',
        pages: 240,
        publisher: 'Marcus Artisan Poetry Press',
        year: 1923,
        isbn: '978-0140424508',
        coverImage: '/images/cover_poetry_verses_1793943548062.jpg',
        accentColor: '#15803D',
        rating: 4.9,
        reviewsCount: 165,
        stock: 20,
    },
    {
        id: 'poet-2',
        title: 'Leaves of Grass',
        author: 'Walt Whitman',
        category: 'poetry',
        price: 29,
        description: 'Whitman\'s groundbreaking, ecstatic celebration of democracy, nature, the human body, and transcendent cosmic interconnectedness.',
        details: 'The original revolutionary collection that redefined poetic form. Free of rigid rhyme and meter, Whitman\'s long, rolling cadences celebrate the sacredness of common experience, self-discovery, and natural majesty.',
        quote: 'I celebrate myself, and sing myself, / And what I assume you shall assume, / For every atom belonging to me as good belongs to you.',
        pages: 464,
        publisher: 'Penguin Classics Deluxe',
        year: 1855,
        isbn: '978-0140421996',
        coverImage: '',
        accentColor: '#047857',
        rating: 4.8,
        reviewsCount: 188,
        stock: 14,
    },
    {
        id: 'poet-3',
        title: 'The Sun and Her Flowers',
        author: 'Rupi Kaur',
        category: 'poetry',
        price: 24,
        description: 'A vibrant, delicate collection divided into five chapters of wilting, falling, rooting, rising, and blooming, exploring migration, self-love, and healing.',
        details: 'Illustrated with author line drawings, Kaur\'s accessible and evocative verses trace the lifecycle of growth and renewal. A modern classic celebrated for vulnerability, cultural pride, and emotional clarity.',
        quote: 'what is stronger than the human heart which shatters over and over and still lives.',
        pages: 256,
        publisher: 'Andrews McMeel Publishing',
        year: 2017,
        isbn: '978-1449486792',
        coverImage: '',
        accentColor: '#B45309',
        rating: 4.7,
        reviewsCount: 410,
        stock: 35,
    },
];
// ---------------------------------------------------------
// Resilient Database & Mongoose Layer
// ---------------------------------------------------------
let isMongoLive = false;
let dbStatusMessage = 'Initializing MongoDB connection...';
// Mongoose Schemas
const BookSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, enum: ['philosophy', 'self-help', 'poetry'], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    quote: { type: String, default: '' },
    pages: { type: Number, default: 200 },
    publisher: { type: String, default: 'Marcus Book Store' },
    year: { type: Number, default: 2024 },
    isbn: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    accentColor: { type: String, default: '#292524' },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 100 },
    stock: { type: Number, default: 25 },
});
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'reader' },
    createdAt: { type: Date, default: Date.now },
});
const OrderSchema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, default: 'guest' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deliveryNotes: { type: String, default: '' },
    shippingAddress: {
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    items: [
        {
            bookId: String,
            title: String,
            author: String,
            category: String,
            price: Number,
            quantity: Number,
            coverImage: String,
        },
    ],
    subtotal: Number,
    shippingFee: Number,
    totalAmount: Number,
    currency: { type: String, default: 'usd' },
    paymentMethod: { type: String, default: 'cash_on_delivery' },
    paymentStatus: { type: String, default: 'due_on_delivery' },
    status: { type: String, default: 'preparing_shipment' },
    createdAt: { type: Date, default: Date.now },
});
const BookModel = mongoose.models.Book || mongoose.model('Book', BookSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
// In-Memory fallback store when MongoDB server isn't running locally
class MemoryStore {
    books = [];
    users = [];
    orders = [];
    constructor() {
        this.seed();
    }
    seed() {
        this.books = SEED_BOOKS.map((b, idx) => ({
            ...b,
            _id: `mem_book_${idx + 1}`,
        }));
        const salt = bcrypt.genSaltSync(10);
        const demoPasswordHash = bcrypt.hashSync('password123', salt);
        this.users = [
            {
                _id: 'mem_user_demo_1',
                name: 'Julian Vane',
                email: 'reader@marcusbookstore.com',
                password: demoPasswordHash,
                role: 'member',
                createdAt: new Date(),
            },
        ];
        this.orders = [
            {
                _id: 'mem_order_init_1',
                orderNumber: 'ATL-1092',
                userId: 'mem_user_demo_1',
                customerName: 'Julian Vane',
                customerEmail: 'reader@marcusbookstore.com',
                customerPhone: '+1 (503) 555-0192',
                deliveryNotes: 'Leave with study attendant at front lobby',
                shippingAddress: {
                    address: '742 Evergreen Terrace',
                    city: 'Portland',
                    state: 'OR',
                    postalCode: '97201',
                    country: 'United States',
                },
                items: [
                    {
                        bookId: 'phil-1',
                        title: 'Meditations',
                        author: 'Marcus Aurelius',
                        category: 'philosophy',
                        price: 28,
                        quantity: 1,
                        coverImage: '/src/assets/images/cover_philosophy_meditations_1793943547251.jpg',
                    },
                ],
                subtotal: 28,
                shippingFee: 0,
                totalAmount: 28,
                currency: 'usd',
                paymentMethod: 'cash_on_delivery',
                paymentStatus: 'paid_on_delivery',
                status: 'delivered',
                createdAt: new Date(Date.now() - 86400000 * 3),
            },
        ];
    }
}
const memoryStore = new MemoryStore();
// Try MongoDB connection with graceful timeout
async function initializeMongo() {
    try {
        mongoose.set('strictQuery', false);
        // Timeout quickly if local mongod is not present, to never hang the dev server
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 2000,
        });
        isMongoLive = true;
        dbStatusMessage = `Connected to MongoDB database (${mongoose.connection.name || 'marcus_book_store'})`;
        console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
        // Seed Mongoose collections
        await seedMongooseData();
    }
    catch (err) {
        isMongoLive = false;
        dbStatusMessage = 'Connected via In-Memory MERN Storage (MongoDB compatible store)';
        console.log(`[MongoDB Notice] Live mongod connection unavailable (${err?.message}). Running with high-performance In-Memory MongoDB-compatible datastore.`);
    }
}
async function seedMongooseData() {
    if (!isMongoLive) {
        memoryStore.seed();
        return;
    }
    try {
        const existingCount = await BookModel.countDocuments();
        if (existingCount === 0) {
            await BookModel.insertMany(SEED_BOOKS);
            console.log(`[MongoDB] Seeded ${SEED_BOOKS.length} curated books (3 Philosophy, 3 Self-Help, 3 Poetry)`);
        }
        const demoUser = await UserModel.findOne({ email: 'reader@marcusbookstore.com' });
        if (!demoUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            await UserModel.create({
                name: 'Julian Vane',
                email: 'reader@marcusbookstore.com',
                password: hashedPassword,
                role: 'member',
            });
            console.log('[MongoDB] Seeded demo reader account (reader@marcusbookstore.com / password123)');
        }
    }
    catch (err) {
        console.error('[MongoDB] Seeding error:', err);
    }
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        next();
    }
}
app.use(authenticateToken);
// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------
// 1. Health & Database Status
app.get('/api/status', async (req, res) => {
    let booksCount = 0;
    let ordersCount = 0;
    if (isMongoLive) {
        try {
            booksCount = await BookModel.countDocuments();
            ordersCount = await OrderModel.countDocuments();
        }
        catch (e) {
            booksCount = memoryStore.books.length;
            ordersCount = memoryStore.orders.length;
        }
    }
    else {
        booksCount = memoryStore.books.length;
        ordersCount = memoryStore.orders.length;
    }
    res.json({
        ok: true,
        isMongoLive,
        engine: isMongoLive ? 'MongoDB Atlas / Local mongod' : 'Resilient MERN In-Memory Engine',
        dbStatusMessage,
        categoriesCount: 3,
        categories: ['philosophy', 'self-help', 'poetry'],
        booksCount,
        ordersCount,
        demoAccount: {
            email: 'reader@marcusbookstore.com',
            password: 'password123',
        },
    });
});
// 2. Database Re-seed Endpoint
app.post('/api/seed', async (req, res) => {
    try {
        if (isMongoLive) {
            await BookModel.deleteMany({});
            await BookModel.insertMany(SEED_BOOKS);
            const demoUser = await UserModel.findOne({ email: 'reader@marcusbookstore.com' });
            if (!demoUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('password123', salt);
                await UserModel.create({
                    name: 'Julian Vane',
                    email: 'reader@marcusbookstore.com',
                    password: hashedPassword,
                    role: 'member',
                });
            }
        }
        memoryStore.seed();
        res.json({
            success: true,
            message: 'Database re-seeded successfully with 9 books (3 Philosophy, 3 Self-Help, 3 Poetry) and demo credentials.',
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. Books: List & Filter
app.get('/api/books', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && typeof category === 'string' && category !== 'all') {
            query.category = category.toLowerCase();
        }
        if (isMongoLive) {
            let books = await BookModel.find(query).lean();
            if (search && typeof search === 'string') {
                const s = search.toLowerCase();
                books = books.filter((b) => b.title.toLowerCase().includes(s) ||
                    b.author.toLowerCase().includes(s) ||
                    b.description.toLowerCase().includes(s));
            }
            return res.json(books);
        }
        else {
            let books = [...memoryStore.books];
            if (query.category) {
                books = books.filter((b) => b.category === query.category);
            }
            if (search && typeof search === 'string') {
                const s = search.toLowerCase();
                books = books.filter((b) => b.title.toLowerCase().includes(s) ||
                    b.author.toLowerCase().includes(s) ||
                    b.description.toLowerCase().includes(s));
            }
            return res.json(books);
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 4. Books: Single Book by ID or slug
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (isMongoLive) {
            const book = (await BookModel.findOne({ id }).lean()) ||
                (mongoose.isValidObjectId(id) ? await BookModel.findById(id).lean() : null);
            if (!book)
                return res.status(404).json({ error: 'Book not found' });
            return res.json(book);
        }
        else {
            const book = memoryStore.books.find((b) => b.id === id || b._id === id);
            if (!book)
                return res.status(404).json({ error: 'Book not found' });
            return res.json(book);
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 5. Auth: Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email, and password.' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        if (isMongoLive) {
            const existing = await UserModel.findOne({ email: normalizedEmail });
            if (existing) {
                return res.status(400).json({ error: 'An account with this email already exists.' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await UserModel.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: 'member',
            });
            const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token,
            });
        }
        else {
            const existing = memoryStore.users.find((u) => u.email === normalizedEmail);
            if (existing) {
                return res.status(400).json({ error: 'An account with this email already exists.' });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = {
                _id: `mem_user_${Date.now()}`,
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role: 'member',
                createdAt: new Date(),
            };
            memoryStore.users.push(newUser);
            const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({
                user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
                token,
            });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 6. Auth: Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        let user = null;
        if (isMongoLive) {
            user = await UserModel.findOne({ email: normalizedEmail });
        }
        else {
            user = memoryStore.users.find((u) => u.email === normalizedEmail);
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 7. Auth: Me
app.get('/api/auth/me', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        let user = null;
        if (isMongoLive) {
            user = await UserModel.findById(req.user.id).select('-password');
        }
        else {
            user = memoryStore.users.find((u) => u._id === req.user?.id);
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 8. Cash on Delivery Checkout Summary & Verification
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { items, customerEmail, shippingAddress } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart' });
        }
        // Calculate subtotal
        let subtotal = 0;
        const validatedItems = items.map((item) => {
            const unitPrice = Number(item.price) || 0;
            const qty = Math.max(1, Number(item.quantity) || 1);
            subtotal += unitPrice * qty;
            return {
                bookId: item.id || item.bookId,
                title: item.title,
                author: item.author,
                category: item.category,
                price: unitPrice,
                quantity: qty,
                coverImage: item.coverImage || '',
            };
        });
        const shippingFee = subtotal >= 50 ? 0 : 5;
        const totalAmount = subtotal + shippingFee;
        res.json({
            paymentMethod: 'cash_on_delivery',
            amount: totalAmount,
            subtotal,
            shippingFee,
            currency: 'usd',
            freeDeliveryUnlocked: shippingFee === 0,
            terms: 'Payment collected upon doorstep courier delivery. Zero upfront charge.',
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 9. Orders: Create / Confirm Cash on Delivery Order
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, deliveryNotes, shippingAddress, items, subtotal, shippingFee, totalAmount, } = req.body;
        if (!items || items.length === 0 || !customerEmail || !customerName || !customerPhone) {
            return res.status(400).json({ error: 'Please provide recipient name, phone number, and delivery address.' });
        }
        const orderNumber = `ATL-${Math.floor(1000 + Math.random() * 9000)}`;
        const orderPayload = {
            orderNumber,
            userId: req.user?.id || 'guest',
            customerName,
            customerEmail,
            customerPhone,
            deliveryNotes: deliveryNotes || '',
            shippingAddress,
            items,
            subtotal: Number(subtotal),
            shippingFee: Number(shippingFee),
            totalAmount: Number(totalAmount),
            currency: 'usd',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'due_on_delivery',
            status: 'preparing_shipment',
            createdAt: new Date(),
        };
        let savedOrder = null;
        if (isMongoLive) {
            savedOrder = await OrderModel.create(orderPayload);
        }
        else {
            savedOrder = {
                _id: `mem_order_${Date.now()}`,
                ...orderPayload,
            };
            memoryStore.orders.unshift(savedOrder);
        }
        res.status(201).json({
            success: true,
            order: savedOrder,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 10. Orders: Get User Orders
app.get('/api/orders', async (req, res) => {
    try {
        const userId = req.user?.id;
        const userEmail = req.user?.email;
        if (isMongoLive) {
            let query = {};
            if (userId) {
                query = { $or: [{ userId }, { customerEmail: userEmail }] };
            }
            const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
            return res.json(orders);
        }
        else {
            let orders = [...memoryStore.orders];
            if (userId) {
                orders = orders.filter((o) => o.userId === userId || o.customerEmail === userEmail);
            }
            return res.json(orders);
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ---------------------------------------------------------
// Development & Production Serving
// ---------------------------------------------------------
async function startServer() {
    await initializeMongo();
    if (process.env.NODE_ENV === 'production') {
        const distPath = path.join(__dirname, 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
    else {
        // Vite Dev Server middleware
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    }
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Server] Marcus Book Store MERN server running at http://0.0.0.0:${PORT}`);
    });
}
startServer();
