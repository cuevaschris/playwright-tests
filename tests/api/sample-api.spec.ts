import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
const apiKey = String(process.env.API_KEY)

test('Get Request - Tags', async ({ request }) => {
    const response = await request.get('https://conduit-api.bondaracademy.com/api/tags');
    const responseObject = await response.json();
    console.log(responseObject);
    expect(responseObject.tags[0]).toEqual('Test');
    expect(responseObject.tags).toHaveLength(10);
    
});

test('Post Request - Create An Article', async ({ request }) => {
    const date = new Date().getMilliseconds();
    const dogName = faker.animal.dog();
    const randomInfo = dogName+" "+date;
    const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        headers: {
            Authorization: apiKey
        },
        data: {
            "article":{"title":"Sample Article Via Playwright "+randomInfo,"description":"Sample Article Via Playwright "+randomInfo,"body":"Sample Article Via Playwright "+randomInfo,"tagList":["pogi", "chris"]}
        }
    })
    const responseObject = await response.json();
    console.log(responseObject.article);
    expect(responseObject.article.title).toEqual('Sample Article Via Playwright '+randomInfo)
    expect(responseObject.article.author.username).toEqual('yagamcoffee')
    expect(responseObject.article.tagList[0]).toBe('pogi')
    expect(responseObject.article.tagList[1]).toBe('chris')
});


test('Post Request with for-loop - Creating 10 Articles', async ({ request }) => {
    for (let i = 0; i < 10; i++) {
        const date = new Date().getMilliseconds();
        const dogName = faker.animal.dog();
        const randomInfo = dogName+" "+date;

        const response = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
            headers: {
                Authorization: apiKey
            },
            data: {
                "article":{"title":"Sample Article Via Playwright "+randomInfo,"description":"Sample Article Via Playwright "+randomInfo,"body":"Sample Article Via Playwright "+randomInfo,"tagList":["pogi", "chris"]}
            }
        })
        const responseObject = await response.json();
        console.log(responseObject);
        expect(responseObject.article.title).toBe('Sample Article Via Playwright '+randomInfo);
        expect(responseObject.article.author.username).toBe('yagamcoffee');
        expect(responseObject.article.tagList[0]).toBe('pogi');
        expect(responseObject.article.tagList[1]).toBe('chris');

        const deleteResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/'+responseObject.article.slug, {
            headers: {
                Authorization: apiKey
            }
        });
        expect(deleteResponse.status()).toBe(204)
    }
});

test('Sample PUT request', async ({ request }) => {
    const date = new Date().getMilliseconds();
    const dogName = faker.animal.dog();
    const randomInfo = dogName+" "+date;

    const postResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        headers: {
            Authorization: apiKey
        },
        data: {
            "article":{"title":"Sample Article Via Playwright "+randomInfo,"description":"Sample Article Via Playwright "+randomInfo,"body":"Sample Article Via Playwright "+randomInfo,"tagList":["pogi", "chris"]}
        }
    })
    const postResponseObject = await postResponse.json();

    const putResponse = await request.put('https://conduit-api.bondaracademy.com/api/articles/'+postResponseObject.article.slug, {
        headers: {
            Authorization: apiKey
        },
        data: {
            "article":{"title":"Sample Article Via Playwright-PUT-REQUEST "+randomInfo,"description":"Sample Article Via Playwright-PUT-REQUEST"+randomInfo,"body":"Sample Article Via Playwright-PUT-REQUEST"+randomInfo,"tagList":[`${randomInfo}`]}
        }
    })
    expect(putResponse.status()).toBe(200)

    const responseObject = await putResponse.json();
    console.log(responseObject);
    expect(responseObject.article.description).toEqual("Sample Article Via Playwright-PUT-REQUEST"+randomInfo);
    expect(responseObject.article.body).toEqual("Sample Article Via Playwright-PUT-REQUEST"+randomInfo);

});

test('Delete All Created Articles', async ({ request }) => {
    test.setTimeout(60000);
    const response = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=500', {
        headers: {
            Authorization: apiKey
        }
    });
    const responseObject = await response.json();
    const articleCount = responseObject.articlesCount;
    console.log("ARTICLE COUNT "+articleCount);

    // console.log(responseObject.articles[0].author.username); // to get the username of first index of an array

    for (const article of responseObject.articles) {
        if (article.author.username === 'yagamcoffee') {
            const deleteResponse = await request.delete('https://conduit-api.bondaracademy.com/api/articles/'+article.slug, {
                headers: {
                    Authorization: apiKey
                }
            });
            expect(deleteResponse.status()).toBe(204);
        }
    }
    const afterDeletionResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles', {
        headers: {
            Authorization: apiKey
        }
    });
    const afterDeletionResponseObject = await afterDeletionResponse.json();
    const articleCountAfterDeletion = afterDeletionResponseObject.articlesCount;
    console.log('ARTICLE COUNT AFTER DELETION: '+articleCountAfterDeletion)
});

test.skip('Sample PATCH request', async ({ request }) => {
    const date = new Date();
    const dateInfo = date.getMilliseconds(); 

    const response = await request.patch('https://conduit-api.bondaracademy.com/api/articles/Sample-Article-Via-Playwright-78-47548', {
        headers: {
            Authorization: apiKey
        },
        data: {
            "article":{"description":"Sample-Article-Via-Playwright-PATCH-REQUEST"+dateInfo}
        }
    })
    // expect(response.status()).toBe(200)

    // const responseObject = await response.json();
    // console.log(responseObject);
    // expect(responseObject.article.description).toEqual("Sample Article Via Playwright-PUT-REQUEST"+dateInfo);

    console.log(response)

});

test.skip('Sample DELETE request', async ({ request }) => {
    const response = await request.delete('https://conduit-api.bondaracademy.com/api/articles/sdf-47548', {
        headers: {
            Authorization: apiKey
        }
    })
    expect(response.status()).toBe(204);
});