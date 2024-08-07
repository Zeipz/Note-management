const { Note, Category, Tag, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: [
        { model: Category },
        { model: Tag, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });
    const categories = await Category.findAll();
    res.render('index', { 
      notes, 
      categories, 
      title: 'Mis Notas',
      currentCategory: null
    });
  } catch (error) {
    console.error('Error al obtener notas:', error);
    res.status(500).render('error', { message: 'Error al obtener las notas' });
  }
};

exports.getAddNotePage = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.render('add', { categories, title: 'Agregar Nota' });
  } catch (error) {
    console.error('Error al cargar página de agregar nota:', error);
    res.status(500).render('error', { message: 'Error al cargar la página' });
  }
};

exports.addNote = async (req, res) => {
  try {
    const { title, content, category_id, tags } = req.body;
    const note = await Note.create({ title, content, CategoryId: category_id });
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      for (const tagName of tagArray) {
        const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
        await note.addTag(tag);
      }
    }
    
    res.redirect('/');
  } catch (error) {
    console.error('Error al agregar nota:', error);
    res.status(500).render('error', { message: 'Error al agregar la nota' });
  }
};

exports.getEditNotePage = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [Category, Tag]
    });
    const categories = await Category.findAll();
    if (note) {
      res.render('edit', { note, categories, title: 'Editar Nota' });
    } else {
      res.status(404).render('error', { message: 'Nota no encontrada' });
    }
  } catch (error) {
    console.error('Error al cargar nota para editar:', error);
    res.status(500).render('error', { message: 'Error al cargar la nota' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { title, content, category_id, tags } = req.body;
    const note = await Note.findByPk(req.params.id);
    if (note) {
      await note.update({ title, content, CategoryId: category_id });
      await note.setTags([]);
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        for (const tagName of tagArray) {
          const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
          await note.addTag(tag);
        }
      }
      res.redirect('/');
    } else {
      res.status(404).render('error', { message: 'Nota no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    res.status(500).render('error', { message: 'Error al actualizar la nota' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      await note.destroy();
      res.redirect('/');
    } else {
      res.status(404).render('error', { message: 'Nota no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar nota:', error);
    res.status(500).render('error', { message: 'Error al eliminar la nota' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Note,
        attributes: []
      }],
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('Notes.id')), 'count']
      ],
      group: ['Category.id'],
      order: [['name', 'ASC']]
    });
    res.render('categories', { categories, title: 'Categorías' });
  } catch (error) {
    console.error('Error al cargar categorías:', error);
    res.status(500).render('error', { message: 'Error al cargar las categorías' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    await Category.create({ name: req.body.name });
    res.redirect('/categories');
  } catch (error) {
    console.error('Error al añadir categoría:', error);
    res.status(500).render('error', { message: 'Error al añadir la categoría' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.redirect('/categories');
    } else {
      res.status(404).render('error', { message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).render('error', { message: 'Error al eliminar la categoría' });
  }
};

exports.filterByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const notes = await Note.findAll({
      where: { CategoryId: categoryId },
      include: [Category, Tag]
    });
    const categories = await Category.findAll();
    res.render('index', { 
      notes, 
      categories, 
      currentCategory: categoryId,
      title: 'Notas Filtradas'
    });
  } catch (error) {
    console.error('Error al filtrar notas:', error);
    res.status(500).render('error', { message: 'Error al filtrar las notas' });
  }
};

exports.searchNotes = async (req, res) => {
  try {
      const { term } = req.query;
      const notes = await Note.findAll({
          where: {
              [Op.or]: [
                  { title: { [Op.like]: `%${term}%` } },
                  { content: { [Op.like]: `%${term}%` } },
                  { '$Category.name$': { [Op.like]: `%${term}%` } }
              ]
          },
          include: [{
              model: Category,
              attributes: ['id', 'name']
          }]
      });
      res.json(notes);
  } catch (error) {
      console.error('Error en la búsqueda:', error);
      res.status(500).json({ error: 'Error en la búsqueda' });
  }
};