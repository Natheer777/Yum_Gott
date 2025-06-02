import { User, Customer, restaurantOwner, UserType } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { DatabaseConnection } from "../database/DataBaseConnection";

export class UserRepository implements IUserRepository {
  constructor(private db: DatabaseConnection) { }
  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (
        mobile_number, password, user_type, is_active,
        name, email, restaurant_name, organization_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      user.mobileNumber,
      user.password,
      user.userType,
      user.isActive,
      user.userType === UserType.CUSTOMER ? (user as Customer).name : null,
      user.userType === UserType.CUSTOMER ? (user as Customer).email : null,
      user.userType === UserType.RESTAURANT_OWNER ? (user as restaurantOwner).restaurantName : null,
      user.userType === UserType.RESTAURANT_OWNER ? (user as restaurantOwner).restaurantName : null
    ]

    const result = await this.db.query(query, values);
    return this.mapRowToUser(result.rows[0])

  }
  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE mobile_number = $1';
    const result = await this.db.query(query, [mobileNumber])
    if (result.rows.length === 0) {
      return null
    }
    return this.mapRowToUser(result.rows[0]);

  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT * FROM users WHERE id = $1
      `
    const result = await this.db.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapRowToUser(result.rows[0]);
  }


  async update(id: string, user: Partial<User>): Promise<User> {
    // Array to hold SET clauses for SQL UPDATE statement
    const fields: string[] = [];

    // Array to hold parameter values for prepared statement
    const values: any[] = [];

    // Counter to keep track of the parameter positions ($1, $2, etc.)
    let paramCount = 1;

    // If mobileNumber is provided, prepare to update it
    if (user.mobileNumber) {
      fields.push(`mobile_number = $${paramCount++}`);
      values.push(user.mobileNumber);
    }

    // If password is provided, prepare to update it
    if (user.password) {
      fields.push(`password = $${paramCount++}`);
      values.push(user.password);
    }

    // If isActive is provided (including false), prepare to update it
    if (user.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(user.isActive);
    }

    // Check if the user type is CUSTOMER to update customer-specific fields
    if (user.userType === UserType.CUSTOMER) {
      const customer = user as Partial<Customer>;

      // If name is provided, prepare to update it
      if (customer.name) {
        fields.push(`name = $${paramCount++}`);
        values.push(customer.name);
      }

      // If email is provided, prepare to update it
      if (customer.email) {
        fields.push(`email = $${paramCount++}`);
        values.push(customer.email);
      }
    }

    // Check if the user type is RESTAURANT_OWNER to update restaurant owner-specific fields
    if (user.userType === UserType.RESTAURANT_OWNER) {
      const owner = user as Partial<restaurantOwner>;

      // If restaurantName is provided, prepare to update it
      if (owner.restaurantName) {
        fields.push(`restaurant_name = $${paramCount++}`);
        values.push(owner.restaurantName);
      }

      // If organizationNumber is provided, prepare to update it
      if (owner.organizationNumber) {
        fields.push(`organization_number = $${paramCount++}`);
        values.push(owner.organizationNumber);
      }
    }

    // Add the ID parameter last for the WHERE clause
    values.push(id);

    // Construct the final SQL UPDATE query with dynamic SET clause
    const query = `
    UPDATE users 
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

    // Execute the query with all the collected parameter values
    const result = await this.db.query(query, values);

    // Map the updated row data back to a User entity and return it
    return this.mapRowToUser(result.rowss[0]);
  }

  async delete(id: string): Promise<void> {


    const query = 'DELETE FROM users WHERE id = $1'
    await this.db.query(query, [id]);
  }

  async existsByMobileNumber(mobileNumber: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE mobile_number = $1 LIMIT 1';
    const result = await this.db.query(query, [mobileNumber]);
    return result.rows.length > 0
  }


  async existsByEmail(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = $1 LIMIT 1'
    const result = await this.db.query(query, [email])
    return result.rows.length > 0
  }

  async existsByOrganizationNumber(organizationNumber: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE organization_number = $1 LIMIT 1';
    const result = await this.db.query(query, [organizationNumber]);
    return result.rows.length > 0
  }

  private mapRowToUser(row: any): User {
    const baseUser = {
      id: row.id,
      mobileNumber: row.mobile_number,
      password: row.password,
      userType: row.user_type,
      isActive: row.is_active,
      created: row.created_at,
      updateAt: row.update_ar
    }
    if (row.user_type === UserType.CUSTOMER) {
      return {
        ...baseUser,
        name: row.name,
        email: row.email,
        userType: UserType.CUSTOMER,
      } as Customer;
    } else {
      return {
        ...baseUser,
        organizationNumber: row.organization_number,
        restaurantName: row.restaurant_name,
        userType: UserType.RESTAURANT_OWNER
      } as restaurantOwner;
    }
  }
}