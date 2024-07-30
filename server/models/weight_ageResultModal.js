module.exports = (sequelize, DataTypes) => {
  const WeightAge = sequelize.define("weight_age", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    neg3sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      neg2sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      neg1sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd0: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd1: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd2: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd3: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
      timestamps: false,
    }
);
    return WeightAge;
};
