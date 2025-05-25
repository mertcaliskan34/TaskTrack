const User = require('./userSchema');

const UserModel = {
  // Kullanıcı oluşturma
  async create(username, email, password) {
    try {
      const newUser = new User({
        username,
        email,
        password
      });
      const savedUser = await newUser.save();
      return savedUser._id;
    } catch (error) {
      throw error;
    }
  },

  // Email ile kullanıcı bulma
  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı adı ile kullanıcı bulma
  async findByUsername(username) {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw error;
    }
  },

  // ID ile kullanıcı bulma
  async findById(id) {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      
      return {
        user_id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      };
    } catch (error) {
      throw error;
    }
  },

  // Tüm kullanıcıları getirme
  async findAll() {
    try {
      const users = await User.find({}, 'username email created_at');
      return users.map(user => ({
        user_id: user._id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      }));
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı güncelleme
  async update(id, userData) {
    try {
      const { username, email } = userData;
      const result = await User.findByIdAndUpdate(id, { username, email }, { new: true });
      return !!result;
    } catch (error) {
      throw error;
    }
  },

  // Şifre güncelleme
  async updatePassword(id, password) {
    try {
      const result = await User.findByIdAndUpdate(id, { password });
      return !!result;
    } catch (error) {
      throw error;
    }
  },

  // Kullanıcı silme
  async delete(id) {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = UserModel; 