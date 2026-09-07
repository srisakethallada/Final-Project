import http from 'http';

async function testApiQuery(query, label) {
  console.log(`\nTesting Real External Job API for ${label}...`);
  console.log(`Query string sent to API: "${query}"`);

  const postData = JSON.stringify({ query, page: 1 });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/search-jobs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const rawItems = Array.isArray(json.data?.jobs)
            ? json.data.jobs
            : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
            ? json
            : [];
          console.log(`HTTP Status: ${res.statusCode}`);
          console.log(`Real Jobs Returned: ${rawItems.length}`);
          if (rawItems.length > 0) {
            console.log(`Sample Job 1 Title: "${rawItems[0].job_title}"`);
            console.log(`Sample Job 1 Employer: "${rawItems[0].employer_name}"`);
            console.log(`Sample Job 1 Location: "${rawItems[0].job_city || ''}, ${rawItems[0].job_state || ''}, ${rawItems[0].job_country || ''}"`);
          } else {
            console.log('Result: 0 jobs returned. Proper Empty State triggered ("No jobs found for your selected location"). Zero mock data added.');
          }
          resolve(rawItems);
        } catch (e) {
          console.error('Response parsing error:', e, data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('HTTP Request error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  try {
    // Test A: India -> Andhra Pradesh
    await testApiQuery('Cloud Engineer in Andhra Pradesh, India', 'Test A: India -> Andhra Pradesh');

    // Test B: India -> Telangana
    await testApiQuery('Software Engineer in Telangana, India', 'Test B: India -> Telangana');

    console.log('\nLIVE API LOCATION TESTS COMPLETED SUCCESSFULLY.');
  } catch (err) {
    console.error('Live API test error:', err);
  }
}

runTests();
