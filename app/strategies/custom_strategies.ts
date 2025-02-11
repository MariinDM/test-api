import string from '@adonisjs/core/helpers/string'
import { CamelCaseNamingStrategy, BaseModel } from '@adonisjs/lucid/orm'

class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
    columnName(_model: typeof BaseModel, propertyName: string) {
        return string.snakeCase(propertyName)
    }
}

export default MyCustomNamingStrategy
