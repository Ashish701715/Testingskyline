import jwt from '../getLoggedUser/GetUserInfomation';
import { university_Api } from '../APIurl/url';

/**
 * Fetches university records with debouncing.
 *
 * @param {any} query - The university ID to fetch records for.
 * @returns {Promise<any>} - A promise resolving to the university records.
 * @example
 * const universityId = 123;
 * const records = await debouncedUniversityRecord(universityId);
 * console.log(records); // Output: University records for ID 123
 */
const debouncedUniversityRecord = async (query: any, Search: any, currentPage: any, itemsPerPage: any, totalPages: any) => {
  try {
    const jwttoken = jwt('jwt');
    const url = university_Api + '?univeristyId=' + query + '&search_input=' + Search + '&currentPage=' + currentPage + '&itemsPerPage=' + itemsPerPage + '&totalPages=' + totalPages;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authenticate: `Bearer ${jwttoken}`,
      },
      body: JSON.stringify({
        PAGE_REQUEST: 'GET_PROGRAM_DATA_ADMIN',
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

/**
 * A wrapper function for debouncedUniversityRecord.
 *
 * @param {any} query - The university ID to fetch records for.
 * @returns {Promise<any>} - A promise resolving to the university records.
 * @example
 * const universityId = 456;
 * const records = await UniversityRecord(universityId);
 * console.log(records); // Output: University records for ID 456
 */
const UniversityRecord = async (query: any, Search: any, currentPage: any, itemsPerPage: any, totalPages: any) => {
  return await debouncedUniversityRecord(query, Search, currentPage, itemsPerPage, totalPages);
};

export default UniversityRecord;