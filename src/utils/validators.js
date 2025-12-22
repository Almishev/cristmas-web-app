export const validateOrder = (order) => {
  const errors = {}

  if (!order.childName || order.childName.trim().length < 2) {
    errors.childName = 'Child name must be at least 2 characters'
  }

  if (!order.country || order.country.trim() === '') {
    errors.country = 'Country is required'
  }

  if (!order.toyId) {
    errors.toyId = 'Please select a toy'
  }

  return errors
}

export const validateToy = (toy) => {
  const errors = {}

  if (!toy.name || toy.name.trim().length < 2) {
    errors.name = 'Toy name must be at least 2 characters'
  }

  if (!toy.category || toy.category.trim() === '') {
    errors.category = 'Category is required'
  }

  if (!toy.difficulty || !['Easy', 'Medium', 'Hard'].includes(toy.difficulty)) {
    errors.difficulty = 'Difficulty must be Easy, Medium, or Hard'
  }

  return errors
}

export const validateElf = (elf) => {
  const errors = {}

  if (!elf.name || elf.name.trim().length < 2) {
    errors.name = 'Elf name must be at least 2 characters'
  }

  if (!elf.role || elf.role.trim() === '') {
    errors.role = 'Role is required'
  }

  if (elf.energy === undefined || elf.energy === null || elf.energy < 0 || elf.energy > 100) {
    errors.energy = 'Energy must be between 0 and 100'
  }

  return errors
}
