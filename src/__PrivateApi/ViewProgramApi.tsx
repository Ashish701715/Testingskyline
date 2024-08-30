
import jwt from '../getLoggedUser/GetUserInfomation';
import { university_Api } from '../APIurl/url';

const debouncedProgramRecord = async (programId:number) => {
  try {
    const jwttoken = jwt('jwt');
    const apiGetdata = `?action=getProgramData-infomation&id=${programId}`;
    const url = university_Api + apiGetdata;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authenticate: `Bearer ${jwttoken}`,
      },
      body: JSON.stringify({
        PAGE_REQUEST: 'GET_FULL_PROGRAM_DATA_ADMIN',
        programId: programId,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
const ProgramRecord = async (programId:number) => {
  return await debouncedProgramRecord(programId);
};

export default ProgramRecord;