from digi.xbee.devices import XBeeDevice
from digi.xbee.models.address import *
from digi.xbee.devices import RemoteXBeeDevice

def data_received_callback(xbee_message):
	address = xbee_message.remote_device.get_64bit_addr()
	data = xbee_message.data.decode('utf8')
	print('Received data from %s: %s' % (address, data))




device_path_computer = '/dev/tty.usbserial-DN06AABE'
device_path_bb = '/dev/ttymxc7'
device_bb_64 = '0013A2004186D1B7'
device_computer_64 = '0013A2004186D1E6'

# change this if using the bb
device_path = device_path_computer

device = XBeeDevice(device_path, 9600)
device.open()

device.add_data_received_callback(data_received_callback)

remote_device = RemoteXBeeDevice(device, XBee64BitAddress.from_hex_string(device_bb_64))
