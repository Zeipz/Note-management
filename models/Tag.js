module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Note, { through: 'NoteTags' });
  };

  return Tag;
};