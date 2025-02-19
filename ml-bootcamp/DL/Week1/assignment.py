import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
from torchvision import datasets
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

# Define transformations (convert images to tensors and normalize)
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# Load MNIST dataset
train_dataset = datasets.MNIST(root="./data", train=True, transform=transform, download=True)
test_dataset = datasets.MNIST(root="./data", train=False, transform=transform, download=True)

# Create DataLoader for batching
train_loader = DataLoader(dataset=train_dataset, batch_size=32, shuffle=True)
test_loader = DataLoader(dataset=test_dataset, batch_size=32, shuffle=False)

print(f"Loaded {len(train_loader)} training batches and {len(test_loader)} test batches.")


# Define a modified neural network with additional layers
class CustomNN(nn.Module):
    def __init__(self):
        super(CustomNN, self).__init__()
        self.fc1 = nn.Linear(28*28, 128)  # Input layer
        self.fc2 = nn.Linear(128, 64)     # Hidden layer
        self.fc3 = nn.Linear(64, 10)      # Output layer

    def forward(self, x):
        x = x.view(-1, 28*28)  # Flatten input
        x = F.relu(self.fc1(x))  # Activation function
        x = F.relu(self.fc2(x))
        x = self.fc3(x)  # Output logits
        return x

# Instantiate the model
model = CustomNN()
print(model)


class CustomLoss(nn.Module):
    def __init__(self):
        super(CustomLoss, self).__init__()

    def forward(self, outputs, targets):
        loss = torch.mean((F.log_softmax(outputs, dim=1) - F.one_hot(targets, num_classes=10).float())**2)
        return loss

# Instantiate custom loss function
criterion = CustomLoss()
criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)


num_epochs = 10

def evaluate_model(model, dataloader, criterion):
    model.eval()  # Set model to evaluation mode
    total_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():  # Disable gradient calculation
        for inputs, labels in dataloader:
            inputs, labels = inputs.view(-1, 28*28), labels
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            total_loss += loss.item()
            predicted = torch.argmax(outputs, dim=1)
            correct += (predicted == labels).sum().item()
            total += labels.size(0)

    avg_loss = total_loss / len(dataloader)
    accuracy = correct / total
    print(f"Validation Loss: {avg_loss:.4f}, Accuracy: {accuracy:.4%}")

# Evaluate model on test dataset
evaluate_model(model, test_loader, criterion)


# Initialize TensorBoard writer
writer = SummaryWriter("runs/custom_nn")

for epoch in range(num_epochs):
    model.train()  # Set model to training mode
    running_loss = 0
    correct = 0
    total = 0

    for inputs, labels in train_loader:
        # inputs, labels = inputs, labels 
        
        inputs = inputs.view(-1, 28 * 28)  # Flatten input

        optimizer.zero_grad()  # Reset gradients
        outputs = model(inputs)  # Forward pass
        loss = criterion(outputs, labels)  # Compute loss
        loss.backward()  # Backpropagation
        optimizer.step()  # Update weights

        # Track training accuracy
        running_loss += loss.item()
        predicted = torch.argmax(outputs, dim=1)
        correct += (predicted == labels).sum().item()
        total += labels.size(0)

    epoch_loss = running_loss / len(train_loader)
    epoch_accuracy = correct / total * 100

    print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%")

print("Training complete!")


# Example: Log dummy training loss
for epoch in range(10):
    loss = torch.exp(-torch.tensor(epoch/10))  # Simulated decreasing loss
    writer.add_scalar("Training Loss", loss, epoch)

# Launch TensorBoard using `tensorboard --logdir=runs/custom_nn`

