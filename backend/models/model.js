const {sequelize}= require('../config/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('buyer', 'seller'),
        defaultValue: 'buyer'
    }
}, {
    timestamps: true
});


const PendingOrder = sequelize.define('PendingOrder', {
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', // Name of the User table
            key: 'id' // Key in User model
        }
    },
    sellerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users', // Name of the User table
            key: 'id' // Key in User model
        }
    },
    buyerQty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    buyerPrice: {
      type: DataTypes.INTEGER,
        allowNull:true
    },
    sellerPrice: {
      type: DataTypes.INTEGER,
        allowNull: true
    },
    sellerQty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    orderStatus: {
        type: DataTypes.ENUM('pending'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['buyerId', 'sellerId', 'buyerPrice', 'sellerPrice']
        }
    ]
});

const CompletedOrder = sequelize.define('CompletedOrder', {
    buyerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

User.hasMany(PendingOrder, { foreignKey: 'buyerId', as: 'buyerOrders' });
User.hasMany(PendingOrder, { foreignKey: 'sellerId', as: 'sellerOrders' });
PendingOrder.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
PendingOrder.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(CompletedOrder, { foreignKey: 'buyerId', as: 'buyerCompletedOrders' });
CompletedOrder.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

module.exports = {
  User,
  sequelize,
  PendingOrder,
  CompletedOrder
};
