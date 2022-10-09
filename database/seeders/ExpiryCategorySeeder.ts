import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ExpiryCategory from 'App/Models/ExpiryCategory'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ExpiryCategory.createMany([
      {
        name: 'Non-expiry',
      },
      {
        name: 'Expiry',
      },
    ])
  }
}
