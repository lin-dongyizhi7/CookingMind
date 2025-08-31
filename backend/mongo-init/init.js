// MongoDB初始化脚本
// 创建数据库和集合

// 切换到cooking_mind数据库
db = db.getSiblingDB('cooking_mind');

// 创建用户集合
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

// 创建家庭集合
db.createCollection('families');
db.families.createIndex({ "name": 1 });

// 创建食材集合
db.createCollection('ingredients');
db.ingredients.createIndex({ "name": 1 });
db.ingredients.createIndex({ "category": 1 });
db.ingredients.createIndex({ "expiryDate": 1 });

// 创建食谱集合
db.createCollection('recipes');
db.recipes.createIndex({ "title": 1 });
db.recipes.createIndex({ "category": 1 });
db.recipes.createIndex({ "difficulty": 1 });

// 创建烹饪记录集合
db.createCollection('cooking_sessions');
db.cooking_sessions.createIndex({ "userId": 1 });
db.cooking_sessions.createIndex({ "recipeId": 1 });
db.cooking_sessions.createIndex({ "createdAt": 1 });

// 创建营养记录集合
db.createCollection('nutrition_records');
db.nutrition_records.createIndex({ "userId": 1 });
db.nutrition_records.createIndex({ "date": 1 });

// 创建系统配置集合
db.createCollection('system_configs');
db.system_configs.insertOne({
  key: "app_version",
  value: "1.0.0",
  description: "应用版本号",
  createdAt: new Date(),
  updatedAt: new Date()
});

// 创建默认管理员用户（密码需要在实际使用时修改）
db.users.insertOne({
  username: "admin",
  email: "admin@cookingmind.com",
  password: "$2b$10$placeholder_hash_here", // 实际使用时需要加密
  role: "admin",
  status: "active",
  profile: {
    firstName: "系统",
    lastName: "管理员",
    avatar: "",
    bio: "系统默认管理员账户"
  },
  preferences: {
    defaultCuisine: "chinese",
    difficultyLevel: "intermediate",
    tastePreferences: ["spicy", "umami"],
    cookingTime: "medium"
  },
  nutritionGoals: {
    dailyCalories: 2200,
    protein: 80,
    carbs: 250,
    fat: 70,
    fiber: 25,
    water: 2000
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// 创建默认家庭
db.families.insertOne({
  name: "默认家庭",
  description: "系统默认创建的家庭",
  ownerId: ObjectId(), // 这里需要关联到实际的用户ID
  members: [],
  settings: {
    mealReminders: true,
    ingredientExpiryReminders: true,
    notifications: true
  },
  preferences: {
    cuisine: "chinese",
    cookingTime: "medium",
    spiceLevel: "medium"
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print("✅ MongoDB数据库初始化完成！");
print("📊 已创建以下集合：");
print("   - users (用户)");
print("   - families (家庭)");
print("   - ingredients (食材)");
print("   - recipes (食谱)");
print("   - cooking_sessions (烹饪记录)");
print("   - nutrition_records (营养记录)");
print("   - system_configs (系统配置)");
print("👤 已创建默认管理员账户：admin@cookingmind.com");
print("🏠 已创建默认家庭：默认家庭");
