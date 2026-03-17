import { expect, request, test } from '@playwright/test';
import { faker } from '@faker-js/faker'

const baseURL = 'https://apichallenges.eviltester.com'

async function getXChallengerHeader(){
    const apiContext = await request.newContext();
    const postResponse = await apiContext.post(`${baseURL}/challenger`);
    const postResponseHeaders = postResponse.headers();
    const xchallengerAuth = postResponseHeaders['x-challenger']
    return xchallengerAuth;
}

// 1st Approach 
// const xchallenger = 'd002d37b-ce10-4371-9aed-7bda749d94c3'
// ^ generate an xchallenger by running the ID-01 then update the value above. 

test.describe('Evil tester', () => {
    /* THERE ARE TWO APPROACHES IN STORING THE XCHALLENGER Value: 
       1. Creating a xchallenger out of test-scoped - const xchallenger = ... 
       - Use this approach when you are developing and debugging the API Results after a Local or CI/CD runs. 
       
       2. (BY DEFUALT) Creating a process.env.xchallenger inside a test-scoped that is available to other tests. - process.env.xchallenger 
       - Use this approach if you don't need to remember the XChallenger value. Mostly used in CI/CD runs. 
    */

    test.beforeAll('ID-01: POST request to get X-challenger header', async ({ request }) => {
        // Issueing a POST request to get an xchallenger to record api results.
        const xchallengerAuth = await getXChallengerHeader();

        // 2nd Approach: Creating a process.env.xchallenger inside a test-scoped that is available to other tests.
        process.env.xchallenger = xchallengerAuth
        console.log("CURRENT XCHALLENGER VALUE: "+xchallengerAuth);
    });

    test.skip('DELETE ALL TODO ITEMS', async ({ request }) => {
        const getAllTodoItems = await request.get(`${baseURL}/todos`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        }); 
        const getAllTodoItemsObject = await getAllTodoItems.json();
        console.log(getAllTodoItemsObject)
        
        for(const todoItem of getAllTodoItemsObject.todos) {
            const todoItemID = todoItem.id
            const deleteEachToDoItem = await request.delete(`${baseURL}/todos/${todoItemID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Challenger': `${process.env.xchallenger}`
                }
            });
            console.log(deleteEachToDoItem)
            console.log(deleteEachToDoItem.status())
        }
        
        const getAllTodoItemID = await getAllTodoItemsObject.todos[1].id;
        console.log(getAllTodoItemID);
    });

    test('ID-02: First Challenge - Get Request', async ({ request }) => {
        const getResponse = await request.get(`${baseURL}/challenges`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        console.log("ID-02 XCHALLENGER: "+process.env.xchallenger);
        console.log(getResponse)
        expect(getResponse.status()).toBe(200);
    });

    test('ID-03: Get Challenges - /todos', async ({ request }) => {
        const todoGetResponse = await request.get(`${baseURL}/todos`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        const todoGetResponseObject = await todoGetResponse.json();
        console.log(todoGetResponseObject) 
        expect(todoGetResponse.status()).toBe(200);
    });

    test('ID-04: Get Challenges - /todo', { tag: '@negative' }, async ({ request }) => {
        const todoGetResponse = await request.get(`${baseURL}/todo`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        expect(todoGetResponse.status()).toBe(404);
    });


    test('ID-05: Get Challenges - /todos/{id}', async ({ request }) => {
        const todoGetResponse = await request.get(`${baseURL}/todos/5`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        const todoGetResponseObject = await todoGetResponse.json();
        console.log(todoGetResponseObject);
    });

    test('ID-06: Get Challenges - /todos/{id-not-existing}', async ({ request }) => {
        const todoGetResponse = await request.get(`${baseURL}/todos/999`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        expect(todoGetResponse.status()).toBe(404); // /todos/999 is not existing so it would be 404 (not found)
        console.log(await todoGetResponse.json());
    });

    test('ID-07: Get Challenges - /todos? filter using doneStatus field', async ({ request }) => {
        // Pre-condition: To create a todo item with doneStatus: True
        await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.company.name(), "doneStatus": true, "description": faker.company.name()
            }
        });
        const todoGetResponseWithFilter = await request.get(`${baseURL}/todos?doneStatus=true`, {
            headers: {
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        expect(todoGetResponseWithFilter.status()).toBe(200)
    });

    test('ID-08: HEAD Challenges', async ({ request }) => {
        const head = await request.head(`${baseURL}/todos`, {
            headers: {
                'Content-type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }
        })
        console.log(head)
    });
    test('ID-09: Creation Challenges with POST - POST /todos', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.company.name(), "doneStatus": true, "description": faker.company.name()
            }
        });
        console.log(await postResponse.json())
    });

    test('ID-010: Creation Challenges with POST - POST / todos (400) doneStatus', async ({ request }) => {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "Invalid Done Status Value", doneStatus: "invalid"
            }
        })
        expect(postResponse.status()).toBe(400)
    })

    test('ID-011: Creation Challenges with POST - POST /todos title too long', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.string.alpha(51), "doneStatus": true, "description": faker.company.name()
            }
        });
        console.log(postResponse)
        console.log(await postResponse.json())
    });

    test('ID-012: Creation Challenges with POST - POST /todos description too long', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.company.name(), "doneStatus": true, "description": faker.string.alpha(201)
            }
        });
        console.log(postResponse)
        console.log(await postResponse.json())
    });

    test('ID-013: Creation Challenges with POST - POST /todos use max char for title and descr', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.string.alpha(50), "doneStatus": true, "description": faker.string.alpha(200)
            }
        });
        console.log(postResponse)
        console.log(await postResponse.json())
    });

    test('ID-014: Creation Challenges with POST - POST /todos (413) payload content too long', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.string.alpha(50), "doneStatus": true, "description": faker.string.alpha(5001)
            }
        });
        console.log(postResponse)
        console.log(await postResponse.json())
    });

    test('ID-015: Creation Challenges with POST - POST /todos (400) unrecognised field', async ({ request })=> {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.string.alpha(50), amIHandsome: true, "doneStatus": true, "description": faker.string.alpha(100)
            }
        });
        console.log(postResponse)
        console.log(await postResponse.json())
    });

    test('ID-016: Creation Challenges with PUT - PUT /todos/{id} (400) should not create a todo with PUT', async ({ request })=> {
        const postResponse = await request.put(`${baseURL}/todos/999`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: faker.string.alpha(50), amIHandsome: true, "doneStatus": true, "description": faker.string.alpha(100)
            }
        });
        console.log(postResponse)
    });

    test('ID-017: Update Challenges with POST - /todos/{id} (200) update partial content', async ({ request }) => {
        const getResponse = await request.get(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            },
        });
        console.log("BEFORE UPDATE: ");
        console.log(await getResponse.json());

        const updateTodoTitlePostResponse = await request.post(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "process payments - updated"
            }
        });

        const updatedTodoTitleObject = await updateTodoTitlePostResponse.json()
        console.log("AFTER UPDATE: ");
        console.log(updatedTodoTitleObject);
        expect(updatedTodoTitleObject.title).toBe("process payments - updated")
    });

    test('ID-018: Update Challenges with POST - /todos/{id} (404) unexisting todo item', async ({ request }) => {
        const updateTodoTitlePostResponse = await request.post(`${baseURL}/todos/999`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "process payments - updated"
            }
        });

        expect(updateTodoTitlePostResponse.status()).toBe(404)
    });

    test('ID-019: Update Challenges with PUT - /todos/{id} update todo by providing full details (200) ', async ({ request }) => {
        const updateTodoPutResponse = await request.put(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "process payments - updated by put request id-019", doneStatus: true, description: "process payments - updated by put request id-019"
            }
        });
        console.log(updateTodoPutResponse)
        console.log(await updateTodoPutResponse.json())
        expect(updateTodoPutResponse.status()).toBe(200)    // no new item. only update todo item.
    });

    test('ID-020: Update Challenges with PUT - /todos/{id} update todo by providing partial details - title (200) ', async ({ request }) => {
        // BEFORE
        // {
        //   id: 3,
        //   title: 'process payments - updated by put request id-019',
        //   doneStatus: false,
        //   description: 'process payments - updated by put request id-019'
        // }

        const updateTodoPutResponse = await request.put(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "process payments - partial update"
            }
        });
        console.log(updateTodoPutResponse)
        console.log(await updateTodoPutResponse.json())
        expect(updateTodoPutResponse.status()).toBe(200)    // no new item. only update todo item.

        // {
        //   id: 3,
        //   title: 'process payments - partial update',
        //   doneStatus: false,
        //   description: ''
        // }
        // ^ Description field return to null since it was not provided in put request. Same as doneStatus, returns to false (default value)

    });

    test('ID-021: Update Challenges with PUT - /todos/{id} update todo by providing not mandatory field - desc or doneStatus (200) ', async ({ request }) => {
        const updateTodoPutResponse = await request.put(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                doneStatus: false
            }
        });
        console.log(updateTodoPutResponse)
        console.log(await updateTodoPutResponse.json())
        expect(updateTodoPutResponse.status()).toBe(400)    // no new item. only update todo item.
    });

    test('ID-022: Update Challenges with PUT - /todos/{id} update autogenerated item such as id (400) ', async ({ request }) => {
        const updateTodoPutResponse = await request.put(`${baseURL}/todos/3`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                id: 99
            }
        });
        console.log(updateTodoPutResponse)
        console.log(await updateTodoPutResponse.json())
        expect(updateTodoPutResponse.status()).toBe(400)    // no new item. only update todo item.
    });

    test('ID-023: DELETE TODO - /todos/{id} (200)', async ({ request }) => {
        const deleteResponse = await request.delete(`${baseURL}/todos/13`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        console.log(deleteResponse)
    });

    test('ID-024: OPTIONS Challenge - Use OPTIONS verb and check the Allow header.', async ({ request }) => {
        // Playwright doesn't have built-in request.option, but we can use the generic fetch() method and specifying the method: OPTIONS
        const optionResponse = await request.fetch(`${baseURL}/todos`, {
            method: 'OPTIONS',
            headers: {
                'Content-Type': 'application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        // console.log(optionResponse);
        // IMPORTANT to check the Allow header to show what verbs are allowed to be used on the endpoint.
        const optionsResponseHeaders = optionResponse.headers()
        const endpointAllowHeader = optionsResponseHeaders['allow']
        console.log(endpointAllowHeader)
    });

    test('ID-025: ACCEPT Challenge - GET /todos (200) XML', async ({ request }) => {
        const getResponseWithAllowHeaderXML = await request.get(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/xml', 
                'X-Challenger': `${process.env.xchallenger}`
            }
        })
        console.log(getResponseWithAllowHeaderXML)
    }); 
    // Study about the comparison of 'Accept' and 'Content-Type' Headers 

    test('ID-027: ACCEPT Challenge - GET /todos (200) JSON', async ({ request }) => {
        const getResponseWithAllowHeaderJSON = await request.get(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/json', 
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        console.log(getResponseWithAllowHeaderJSON);
    });

    test('ID-028: ACCEPT Challenge - GET /todos (200) XML pref', async ({ request }) => {
        const getResponseWithAllowHeaderXMLJSON = await request.get(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/xml,application/json',
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        console.log(getResponseWithAllowHeaderXMLJSON);
    }); 
    // Study why do we need to add multiple values for the 'Accept' headers.
    
    test('ID-029: ACCEPT Challenge - GET /todos (200) no Accept Header', async ({ request }) => {
        const getResponseNoAccept = await request.get(`${baseURL}/todos`, {
            headers: {
                'Accept':'',
                'X-Challenger': `${process.env.xchallenger}`
            }
        });
        console.log(getResponseNoAccept)
    }); 

    test('ID-030: ACCEPT Challenge - GET /todos (406 - Not Acceptable) - Accept header with gzip', async ({ request }) => {
        const getResponse = await request.get(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/gzip',
                'X-Challenger': `${process.env.xchallenger}`
            }
        });

        console.log(getResponse)
        expect(getResponse.status()).toBe(406)
    });

    test('ID-031: CONTENT-TYPE Challenges - POST /todos xml', async ({ request }) => {
        const xmlPayload = `
          <todos>    
            <title>TODO CREATION USING XML</title>
            <doneStatus>true</doneStatus>
            <description>Blick Group</description>
          </todos>
        `;
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/xml', 
                'Content-Type': 'application/xml', 
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: `
            <title>"TODO CREATION USING XML"</title>
            <doneStatus>true</doneStatus>
            <description>"Blick Group"</description>
            `
        });
        console.log(postResponse)
    })


    test('ID-032: CONTENT-TYPE Challenges - POST /todos json', async ({ request }) => {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Accept': 'application/json', 
                'X-Challenger': `${process.env.xchallenger}`
            }, 
            data: {
                title: "Study CI/CD Later"
            }
        });
        console.log(postResponse)
    });

    test('ID-032: CONTENT-TYPE Challenges - POST /todos (415 - unsupported content type)', async ({ request }) => {
        const postResponse = await request.post(`${baseURL}/todos`, {
            headers: {
                'Content-Type': 'application/chris',
                'Accept': 'application/xml',
                'X-Challenger': `${process.env.xchallenger}`
            },
            data: {
                title: "Bambi"
            }
        });
        expect(postResponse.status()).toBe(415);
    })

});
