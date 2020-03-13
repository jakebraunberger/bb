from digi.xbee.devices import XBeeDevice
from digi.xbee.models.address import *
from digi.xbee.devices import RemoteXBeeDevice


def send_file(file_path, device, remote_device):
	# will send a file from the device device to the device remote_device
	fi = open(file_path, 'r')
	text = fi.read()
	text_length = len(text)

	# packets cannot be larger than 256 bytes
	num_iter = int(text_length / 256 + 1)
	start = 0
	for i in range(num_iter):
		message = text[start:start+256]
		start += 256
		device.send_data(message, remote_device)


device_path_bb = '/dev/ttymxc7'
device_comp_64 = '0013A2004186D1E6'
device_path = device_path_bb


device = XBeeDevice(device_path, 9600)
device.open()

remote_device = RemoteXBeeDevice(device, XBee64BitAddress.from_hex_string(device_comp_64))



send_file('BBmain/ccregisters.db', device, remote_device)
