/*
Copyright 2023 The Dapr Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DaprWorkflowClient } from "@dapr/dapr";

async function printWorkflowStatus(client: DaprWorkflowClient, instanceId: string) {
  const workflow = await client.getWorkflowState(instanceId, true);
  console.log(
    `Workflow ${workflow?.name}, created at ${workflow?.createdAt.toUTCString()}, has status ${
      workflow?.runtimeStatus
    }`,
  );
  console.log(`Additional properties: ${JSON.stringify(workflow)}`);
  console.log("--------------------------------------------------\n\n");
}

async function start() {
  const workflowClient = new DaprWorkflowClient();

  console.log("Starting workflow management example");

  // Start a new workflow instance
  const instanceId = await workflowClient.scheduleNewWorkflow("OrderProcessingWorkflow", {
    Name: "Paperclips",
    TotalCost: 99.95,
    Quantity: 4,
  });
  console.log(`Started workflow instance ${instanceId}`);
  await printWorkflowStatus(workflowClient, instanceId);

  // Pause a workflow instance
  await workflowClient.suspendWorkflow(instanceId);
  console.log(`Paused workflow instance ${instanceId}`);
  await printWorkflowStatus(workflowClient, instanceId);

  // Resume a workflow instance
  await workflowClient.resumeWorkflow(instanceId);
  console.log(`Resumed workflow instance ${instanceId}`);
  await printWorkflowStatus(workflowClient, instanceId);

  // Terminate a workflow instance
  // await workflowClient.terminateWorkflow(instanceId, {
  //   reason: "Terminated by user",
  // });
  // console.log(`Terminated workflow instance ${instanceId}`);
  // await printWorkflowStatus(workflowClient, instanceId);

  // Wait for the workflow to complete, 30 seconds!
  await new Promise((resolve) => setTimeout(resolve, 30000));
  await printWorkflowStatus(workflowClient, instanceId);

  // Purge a workflow instance
  await workflowClient.purgeWorkflow(instanceId);
  console.log(`Purged workflow instance ${instanceId}`);
  // This will throw an error because the workflow instance no longer exists.
  await printWorkflowStatus(workflowClient, instanceId);
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
