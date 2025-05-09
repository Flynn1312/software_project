"use server"
import { createConnection } from './createConnection'

/**
 @param {string} username 
 @param {number} income 
 @param {string} incomeType 
 @returns {Promise<boolean>} 
 */
export async function updateIncome(username, income, incomeType) {
  try {
    if (!username || !income || !incomeType) {
      return false;
    }
    
    let monthlyIncome = income;
    if (incomeType === "yearly") {
      monthlyIncome = income / 12;
    }
    
    // Format as £ 
    const formattedIncome = `£${monthlyIncome.toFixed(2)}`;
    
    const connection = await createConnection();
    const query = "UPDATE details SET income = ? WHERE username = ?";
    await connection.query(query, [formattedIncome, username]);
    connection.end();
    
    return true;
  } catch (error) {
    console.error("Error updating income:", error);
    return false;
  }
}