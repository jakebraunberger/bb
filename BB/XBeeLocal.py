from digi.xbee.devices import XBeeDevice
from digi.xbee.models.address import *
from digi.xbee.devices import RemoteXBeeDevice
import hashlib
import sys
from progress.bar import Bar



FILE_OUT = 'test.db'
device_path_computer = '/dev/tty.usbserial-DN06AABE'
device_bb_64 = '0013A2004186D1B7'
device_path = device_path_computer
BAUD = 57600



class FileTransferError(Exception):
    pass
class IncorrectUsage(Exception):
    pass

def main(argv):
    global FILE_OUT
    global device_path_computer
    global device_bb_64
    global device_path
    global BAUD

    if (len(argv) == 1):
        print('\n\nUsage: %s <file to save to> [<remote xbee 64 bit address> <BAUD>]\n\n' % argv[0])
        raise IncorrectUsage()
    elif (len(argv) == 2):
        FILE_OUT = argv[1]
    elif (len(argv) == 3):
        device_bb_64 = argv[2]
    elif (len(argv) == 4):
        BAUD = int(argv[3])
    

    device = XBeeDevice(device_path, BAUD)
    device.open()
    remote_device = RemoteXBeeDevice(device, XBee64BitAddress.from_hex_string(device_bb_64))

    # TX/RX :: First message sent is the length of the file
    print('\n\n')
    b_continue = True
    while(b_continue):
        xbee_message = device.read_data()
        if xbee_message is not None:
            data = xbee_message.data
            data_length = int(data)
            bar = Bar('Processing', max=int(data_length/256))
            device.flush_queues()
            b_continue = False

    

    # TX/RX
    b_continue = True
    fo = open(FILE_OUT, 'wb')

    while(b_continue):
        xbee_message = device.read_data()
        if xbee_message is not None:
            data = xbee_message.data
            if (data[-24:] == bytearray(b'End of the file transfer')):
                b_continue = False
                data = data[0:-24]
            device.flush_queues()
            fo.write(data)
            if (b_continue):
                bar.next()
    fo.close()

    # compute the md5 sum
    md5 = hashlib.md5(open(FILE_OUT,'rb').read()).hexdigest()

    # check the md5 sum of the local file and compare it to that of the remote file
    device.send_data(remote_device, 'Send the md5 please.')

    b_continue = True

    # Get the message
    while(b_continue):
        xbee_message = device.read_data()
        if xbee_message is not None:
            data = xbee_message.data
            b_continue = False

    if (md5 == data.decode()):
        print('File transfer successful.\n\n')
    else:
        print('File transfer did not work.')
        raise FileTransferError()



    device.close()

if __name__ == '__main__':
    main(sys.argv[0:])

