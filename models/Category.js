module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  });
  
  Category.associate = function(models) {
    Category.hasMany(models.Note);
  };

  return Category;
};