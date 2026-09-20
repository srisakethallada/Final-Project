// Scratch test script for AG-002 Location-First Job Discovery
import http from 'http';

async function testSearch(query, page = 1) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, page });
    const req = http.request(
      'http://localhost:3000/api/search-jobs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, json });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- Testing Query 1: Cloud & DevOps Engineer in Hyderabad, Telangana, India ---');
  let res1 = await testSearch('Cloud & DevOps Engineer in Hyderabad, Telangana, India', 1);
  console.log('Status:', res1.status);
  let jobs1 = res1.json?.data?.jobs || res1.json?.data || [];
  console.log('Count:', jobs1.length);
  if (jobs1.length > 0) {
    console.log('Sample titles:', jobs1.slice(0, 5).map(j => ({ title: j.job_title, city: j.job_city, loc: j.job_country })));
  }

  console.log('\n--- Testing Query 2: DevOps Engineer in Hyderabad ---');
  let res2 = await testSearch('DevOps Engineer in Hyderabad', 1);
  console.log('Status:', res2.status);
  let jobs2 = res2.json?.data?.jobs || res2.json?.data || [];
  console.log('Count:', jobs2.length);
  if (jobs2.length > 0) {
    console.log('Sample titles:', jobs2.slice(0, 5).map(j => ({ title: j.job_title, city: j.job_city })));
  }

  console.log('\n--- Testing Query 3: Cloud Engineer in Hyderabad ---');
  let res3 = await testSearch('Cloud Engineer in Hyderabad', 1);
  console.log('Status:', res3.status);
  let jobs3 = res3.json?.data?.jobs || res3.json?.data || [];
  console.log('Count:', jobs3.length);
  if (jobs3.length > 0) {
    console.log('Sample titles:', jobs3.slice(0, 5).map(j => ({ title: j.job_title, city: j.job_city })));
  }
}

run().catch(console.error);
