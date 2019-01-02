#include <SPI.h> //  include the head file to enable the  library.
#include <SoftwareSerial.h>

static uint8_t data[4] = {0x0, 0x0, 0x0, 0x0}; // defined a data matrix
static uint8_t drawing[8] = {0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0};
static uint8_t i = 1; // defined a variable vector
const int CE = 10;    // defined  the CE function pin
int row_index = 0;

SoftwareSerial bluetoothSerial(3, 2); // RX, TX

void draw()
{
    int drawing_index = 0;
    for (drawing_index = 0; drawing_index < 8; drawing_index++)
    {
        // char buf[50];
        // sprintf(buf, "Printing line %d", drawing_index);
        // Serial.println(buf);

        data[0] = ~drawing[drawing_index];
        data[1] = 0xFF;
        data[2] = 0xFF;
        data[3] = 0x01 << drawing_index;

        digitalWrite(CE, LOW);
        SPI.transfer(data[0]);
        SPI.transfer(data[2]);
        SPI.transfer(data[1]);
        SPI.transfer(data[3]);
        digitalWrite(CE, HIGH);
        delay(1);
    }
}

void setup()
{
    pinMode(CE, OUTPUT); //initialized the pin's mode.
    SPI.begin();         // start spi function

    Serial.begin(9600);
    bluetoothSerial.begin(9600);
    //  delay(100);
}

void loop()
{
    uint8_t byte_to_write;

    if (bluetoothSerial.available() > 0)
    {
        if (row_index == 0)
        {
            Serial.print("Reading new stream: ");
        }
        byte_to_write = bluetoothSerial.read();
        char buf[9];
        sprintf(buf, "%02X", byte_to_write);
        Serial.print(buf);

        memcpy(&drawing[row_index], &byte_to_write, sizeof(uint8_t));

        if (row_index == 7)
        {
            Serial.print("\n-- Array to draw -- ");
            for (int i = 0; i < sizeof(drawing); i++)
            {
                char buf[9];
                sprintf(buf, "%02X", drawing[i]);
                Serial.print(buf);
            }
            Serial.print("\n------------- ");

            row_index = 0;
            Serial.println("\n -- Ready to draw --");
        }
        else
        {
            row_index += 1;
            Serial.print("-");
        }
    }

    if (row_index == 0)
    {
        draw();
    }

    delay(1);
}